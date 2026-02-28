import { Env } from "../types/env";

export async function handleAnalyticsRoutes(
    request: Request,
    env: Env
): Promise<Response> {
    return new Response("Analytics routes not implemented yet");
}
