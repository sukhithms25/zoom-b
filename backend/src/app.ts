import { Env } from "./types/env";
import { router } from "./routes";
import queueHandler from "./queue";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await router(request, env);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500 }
      );
    }
  },
  async queue(batch: MessageBatch<any>, env: Env): Promise<void> {
    await queueHandler.queue(batch, env);
  }
};