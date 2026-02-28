import { Env } from "../types/env";

export async function generateSummary(transcript: string, env: Env): Promise<string | null> {
    // If we have an OPENAI_API_KEY starting with AIza, use Gemini
    if (env.OPENAI_API_KEY && env.OPENAI_API_KEY.startsWith("AIza")) {
        const summaryResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.OPENAI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: "You are a meeting summarization assistant. Return structured JSON with keys: summary, key_points, action_items. Here is the transcript:\n\n" + transcript }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.3
                    }
                }),
            }
        );

        if (!summaryResponse.ok) {
            const err = await summaryResponse.text();
            console.error("Gemini Error:", err);
            return null;
        }

        const summaryData = await summaryResponse.json() as any;
        return summaryData.candidates[0].content.parts[0].text;
    }

    // Otherwise fallback to OpenAI
    if (env.OPENAI_API_KEY) {
        const summaryResponse = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "You are a meeting summarization assistant. Return structured JSON with keys: summary, key_points, action_items."
                        },
                        {
                            role: "user",
                            content: transcript
                        }
                    ],
                    temperature: 0.3
                }),
            }
        );

        if (!summaryResponse.ok) {
            const err = await summaryResponse.text();
            console.error("OpenAI Error:", err);
            return null;
        }

        const summaryData = await summaryResponse.json() as any;
        return summaryData.choices[0].message.content;
    }

    return null;
}
