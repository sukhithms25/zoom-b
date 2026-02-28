import { Env } from "../types/env";
import { generateEmbedding } from "./embedding.service";

export async function answerQuestion(
    question: string,
    env: Env
) {
    // 1️⃣ Embed question
    const questionEmbedding = await generateEmbedding(question, env);

    // 2️⃣ Query vector index
    const results = await env.VECTOR_INDEX.query(questionEmbedding, {
        topK: 5,
        returnMetadata: "all"
    });

    const contextChunks = results.matches.map(
        (match: any) => match.metadata?.chunk || ""
    );

    const context = contextChunks.join("\n\n");

    // 3️⃣ Ask LLM with context
    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + env.OPENAI_API_KEY,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text:
                                    "Answer the question based ONLY on the context below.\n\nContext:\n" +
                                    context +
                                    "\n\nQuestion:\n" +
                                    question
                            }
                        ]
                    }
                ]
            })
        }
    );

    const data = await response.json() as any;

    return data.candidates?.[0]?.content?.parts?.[0]?.text;
}
