import { Env } from "./types/env";
import { generateSummary } from "./services/llm.service";
// import { chunkText } from "./utils/chunkText";
// import { generateEmbedding } from "./services/embedding.service";
import { sendMeetingSummaryEmail } from "./services/email.service";

export default {
    async queue(batch: MessageBatch<any>, env: Env) {
        for (const message of batch.messages) {
            try {
                console.log("Processing job:", message.body);

                const { r2Key } = message.body;

                // 1️⃣ Fetch audio from R2
                const object = await env.R2_BUCKET.get(r2Key);

                if (!object) {
                    console.error("File not found in R2:", r2Key);
                    continue;
                }

                const audioBuffer = await object.arrayBuffer();

                // 2️⃣ Send to AssemblyAI
                const uploadResponse = await fetch(
                    "https://api.assemblyai.com/v2/upload",
                    {
                        method: "POST",
                        headers: {
                            authorization: env.ASSEMBLYAI_API_KEY,
                        },
                        body: audioBuffer,
                    }
                );

                if (!uploadResponse.ok) {
                    const errorText = await uploadResponse.text();
                    console.error("AssemblyAI Upload Error:", errorText);
                    continue;
                }

                const uploadData = (await uploadResponse.json()) as { upload_url: string };

                console.log("Uploaded to AssemblyAI:", uploadData);

                // 3️⃣ Request transcription
                const transcriptResponse = await fetch(
                    "https://api.assemblyai.com/v2/transcript",
                    {
                        method: "POST",
                        headers: {
                            authorization: env.ASSEMBLYAI_API_KEY,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            audio_url: uploadData.upload_url,
                            speech_models: ["universal-2"]
                        }),
                    }
                );

                if (!transcriptResponse.ok) {
                    const errorText = await transcriptResponse.text();
                    console.error("AssemblyAI Transcript Error:", errorText);
                    continue;
                }

                const transcriptData = await transcriptResponse.json() as any;
                console.log("Transcript job created:", transcriptData.id);

                const transcriptId = transcriptData.id;

                // Idempotency safety check
                const existing = await env.DB.prepare(
                    "SELECT id FROM transcripts WHERE id = ?"
                )
                    .bind(transcriptId)
                    .first();

                if (existing) {
                    console.log("Transcript already processed. Skipping.");
                    continue;
                }

                let completedTranscript;

                let attempts = 0;

                while (attempts < 40) {
                    attempts++;
                    await new Promise(res => setTimeout(res, 3000));

                    const pollingResponse = await fetch(
                        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
                        {
                            headers: {
                                authorization: env.ASSEMBLYAI_API_KEY,
                            },
                        }
                    );

                    const pollingData = await pollingResponse.json() as any;
                    console.log(`Polling status (Attempt ${attempts}):`, pollingData.status);

                    if (pollingData.status === "completed") {
                        completedTranscript = pollingData;
                        break;
                    }

                    if (pollingData.status === "error") {
                        console.error("Transcription failed:", pollingData.error);
                        break;
                    }
                }

                if (!completedTranscript) {
                    console.error("Polling timeout.");
                    continue;
                }

                const transcriptText = completedTranscript.text;
                console.log("Final transcript:", transcriptText);

                if (!transcriptText || transcriptText.trim().length < 10) {
                    console.log("No meaningful speech detected.");

                    await env.DB.prepare(`
                    INSERT INTO transcripts (id, r2_key, transcript, summary)
                    VALUES (?, ?, ?, ?)
                `)
                        .bind(transcriptId, r2Key, transcriptText || "", null)
                        .run();

                    continue;
                }

                const summaryContent = await generateSummary(transcriptText, env);

                await env.DB.prepare(
                    `
                INSERT INTO transcripts (id, r2_key, transcript, summary)
                VALUES (?, ?, ?, ?)
                `
                )
                    .bind(transcriptId, r2Key, transcriptText, summaryContent)
                    .run();

                console.log("Transcript and summary stored in D1");

                try {
                    let toEmail = "test@example.com";
                    const userId = await env.OAUTH_KV.get("current_user_id");

                    if (userId) {
                        const userRecord = await env.DB.prepare("SELECT email FROM users WHERE id = ?").bind(userId).first();
                        if (userRecord && userRecord.email) {
                            toEmail = userRecord.email as string;
                        }
                    }

                    if (summaryContent) {
    let parsedSummary;

    try {
        const cleaned = summaryContent
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        parsedSummary = JSON.parse(cleaned);
    } catch (err) {
        console.error("Failed to parse summary JSON. Sending fallback.");
        parsedSummary = {
            summary: summaryContent,
            key_points: [],
            action_items: []
        };
    }

   await sendMeetingSummaryEmail(toEmail, parsedSummary, env);
}
                } catch (emailErr) {
                    console.error("Queue email step failed:", emailErr);
                }

                // try {
                //     const chunks = chunkText(transcriptText);

                //     for (let i = 0; i < chunks.length; i++) {
                //         const embedding = await generateEmbedding(chunks[i], env);

                //         await env.VECTOR_INDEX.upsert([
                //             {
                //                 id: `${transcriptId}_${i}`,
                //                 values: embedding,
                //                 metadata: {
                //                     transcriptId,
                //                     chunk: chunks[i]
                //                 }
                //             }
                //         ]);
                //     }

                //     console.log("Embeddings stored in Vector DB");
                // } catch (error) {
                //     console.error("Vector DB error (expected locally):", error);
                // }
            } catch (err) {
                console.error("Queue job failed:", err);
            }
        }
    }
};
