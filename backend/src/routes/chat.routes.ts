import { Env } from "../types/env";
import { answerQuestion } from "../services/rag.service";

export async function handleChatRoutes(
    request: Request,
    env: Env
): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/chat" && request.method === "POST") {
        try {
            const body = await request.json() as { question?: string };
            const { question } = body;

            if (!question) {
                return new Response("Missing question", { status: 400 });
            }

            const answer = await answerQuestion(question, env);

            return new Response(
                JSON.stringify({ answer }, null, 2),
                { headers: { "Content-Type": "application/json" } }
            );
        } catch (error) {
            console.error("Chat route error:", error);
            return new Response(
                JSON.stringify({ error: "Failed to process chat query" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }
    }

    return new Response("Chat routes not implemented yet", { status: 404 });
}
