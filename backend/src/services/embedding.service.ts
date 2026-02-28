import { Env } from "../types/env";

export async function generateEmbedding(text: string, env: Env) {
    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=" + env.OPENAI_API_KEY,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: {
                    parts: [{ text }]
                }
            })
        }
    );

    const data = await response.json() as any;

    if (!response.ok || !data.embedding || !data.embedding.values) {
        console.error("Embedding generation failed:", data);
        return [];
    }

    return data.embedding.values;
}
