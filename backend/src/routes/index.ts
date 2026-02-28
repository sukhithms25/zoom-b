import { Env } from "../types/env";
import { handleAuthRoutes } from "./auth.routes";
import { handleTranscriptRoutes } from "./transcript.routes";
import { handleChatRoutes } from "./chat.routes";
import { handleAnalyticsRoutes } from "./analytics.routes";
import { handleEmailRoutes } from "./email.routes";

export async function router(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/auth")) {
    return handleAuthRoutes(request, env);
  }

  if (url.pathname.startsWith("/transcript") || url.pathname.startsWith("/meeting")) {
    return handleTranscriptRoutes(request, env);
  }

  if (url.pathname.startsWith("/chat")) {
    return handleChatRoutes(request, env);
  }

  if (url.pathname.startsWith("/analytics")) {
    return handleAnalyticsRoutes(request, env);
  }

  if (url.pathname.startsWith("/email")) {
    return handleEmailRoutes(request, env);
  }

  if (url.pathname === "/health") {
    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not Found", { status: 404 });
}