import { Env } from "../types/env";

export async function handleAuthRoutes(
    request: Request,
    env: Env
): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/auth/zoom") {
        const zoomAuthUrl =
            `https://zoom.us/oauth/authorize?` +
            `response_type=code&` +
            `client_id=${env.ZOOM_CLIENT_ID}&` +
            `redirect_uri=${encodeURIComponent(env.ZOOM_REDIRECT_URI)}`;

        return Response.redirect(zoomAuthUrl, 302);
    }

    if (url.pathname === "/auth/callback") {
        const code = url.searchParams.get("code");

        if (!code) {
            return new Response("Missing authorization code", { status: 400 });
        }

        const tokenUrl = "https://zoom.us/oauth/token";

        const basicAuth = btoa(
            `${env.ZOOM_CLIENT_ID}:${env.ZOOM_CLIENT_SECRET}`
        );

        const body = new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: env.ZOOM_REDIRECT_URI,
        });

        const tokenResponse = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                Authorization: `Basic ${basicAuth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body.toString(),
        });

        const tokenData = await tokenResponse.json() as any;

        if (!tokenResponse.ok) {
            return new Response(
                JSON.stringify(tokenData, null, 2),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Store tokens securely in KV
        await env.OAUTH_KV.put(
            "zoom_tokens",
            JSON.stringify(tokenData)
        );

        try {
            const zoomResponse = await fetch("https://api.zoom.us/v2/users/me", {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                },
            });

            if (zoomResponse.ok) {
                const zoomUser = await zoomResponse.json() as any;
                if (zoomUser.id && zoomUser.email) {
                    await env.DB.prepare(
                        `INSERT INTO users (id, email) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET email=excluded.email`
                    ).bind(zoomUser.id, zoomUser.email).run();

                    await env.OAUTH_KV.put("current_user_id", zoomUser.id);
                }
            }
        } catch (error) {
            console.error("Failed to fetch zoom user details:", error);
        }

        return new Response(
            JSON.stringify(
                { message: "Zoom OAuth successful. Tokens stored securely." },
                null,
                2
            ),
            { headers: { "Content-Type": "application/json" } }
        );
    }

    if (url.pathname === "/auth/debug") {
        const stored = await env.OAUTH_KV.get("zoom_tokens");

        if (!stored) {
            return new Response("No tokens found");
        }

        return new Response(stored, {
            headers: { "Content-Type": "application/json" },
        });
    }

    if (url.pathname === "/auth/zoom/me") {
        const stored = await env.OAUTH_KV.get("zoom_tokens");

        if (!stored) {
            return new Response("No tokens stored", { status: 400 });
        }

        const tokens = JSON.parse(stored);

        const zoomResponse = await fetch(
            `${tokens.api_url}/v2/users/me`,
            {
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`,
                },
            }
        );

        const zoomData = await zoomResponse.json();

        return new Response(JSON.stringify(zoomData, null, 2), {
            headers: { "Content-Type": "application/json" },
        });
    }

    if (url.pathname === "/auth/recordings") {
        const stored = await env.OAUTH_KV.get("zoom_tokens");

        if (!stored) {
            return new Response("No tokens stored", { status: 400 });
        }

        const tokens = JSON.parse(stored);

        const response = await fetch(
            `${tokens.api_url}/v2/users/me/recordings`,
            {
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`,
                },
            }
        );

        const data = await response.json();

        return new Response(JSON.stringify(data, null, 2), {
            headers: { "Content-Type": "application/json" },
        });
    }
    return new Response("Auth route not found", { status: 404 });
}

