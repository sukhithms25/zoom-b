export interface Env {
    DB: D1Database;
    OAUTH_KV: KVNamespace;
    R2_BUCKET: R2Bucket;
    JOB_QUEUE: Queue;
    VECTOR_INDEX: VectorizeIndex;

    ZOOM_CLIENT_ID: string;
    ZOOM_CLIENT_SECRET: string;
    ZOOM_REDIRECT_URI: string;

    OPENAI_API_KEY: string;
    ASSEMBLYAI_API_KEY: string;
    EMAIL_API_KEY: string;
    RESEND_API_KEY: string;
}