import { Env } from "../types/env";

export async function handleTranscriptRoutes(
    request: Request,
    env: Env
): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/meeting/upload") {
        try {
            const formData = await request.formData();
            const file = formData.get("file") as unknown as File;

            if (!file || !file.name || !file.stream) {
                return new Response(JSON.stringify({ error: "Missing or invalid file" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            }

            const timestamp = Date.now();
            const filename = file.name || "audio.raw";
            const key = `meetings/${timestamp}-${filename}`;

            // Wait for buffer to be fully allocated before putting into local R2
            const buffer = await file.arrayBuffer();
            await env.R2_BUCKET.put(key, buffer);

            await env.JOB_QUEUE.send({
                type: "TRANSCRIBE",
                r2Key: key
            });

            return new Response(JSON.stringify({
                success: true,
                key: key
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: "Upload failed" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    if (request.method === "GET" && url.pathname === "/transcripts") {
        try {
            const results = await env.DB.prepare(
                "SELECT id, r2_key, created_at FROM transcripts ORDER BY created_at DESC"
            ).all();

            return new Response(JSON.stringify(results.results || results, null, 2), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: "Failed to list transcripts" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    if (request.method === "GET" && url.pathname.startsWith("/transcript/")) {
        const id = url.pathname.split("/")[2];

        try {
            const result = await env.DB.prepare(
                "SELECT * FROM transcripts WHERE id = ?"
            )
                .bind(id)
                .first();

            if (!result) {
                return new Response(JSON.stringify({ error: "Transcript not found" }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                });
            }

            return new Response(JSON.stringify(result, null, 2), {
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: "Failed to retrieve transcript" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    return new Response("Transcript routes not implemented yet");
}
