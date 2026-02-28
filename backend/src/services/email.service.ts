import { Env } from "../types/env";

export async function sendMeetingSummaryEmail(
    to: string,
    summary: {
    summary: string;
    key_points: string[];
    action_items: string[];
},
    env: Env
) {
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: "meetings@resend.dev", // using resend sandbox domain for testing
            to: [to],
            subject: "Your Meeting Summary",
           html: `
<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
    <h2 style="color: #222;">Meeting Summary</h2>

    <h3>Overview</h3>
    <p>${summary.summary}</p>

    ${
        summary.key_points.length > 0
            ? `
        <h3>Key Points</h3>
        <ul>
            ${summary.key_points.map(p => `<li>${p}</li>`).join("")}
        </ul>
    `
            : ""
    }

    ${
        summary.action_items.length > 0
            ? `
        <h3>Action Items</h3>
        <ul>
            ${summary.action_items.map(a => `<li>${a}</li>`).join("")}
        </ul>
    `
            : ""
    }
</div>
`,
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("Email failed:", err);
        return false;
    }

    console.log("Email sent successfully to:", to);
    return true;
}
