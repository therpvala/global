/**
 * Server-only Lovable AI Gateway helpers for AMS Manager.
 * Never import this module from client code — `*.server.ts` files are blocked
 * from client bundles. Server functions load it with `await import(...)`
 * inside the handler after validating input.
 */
import { createOpenAI } from "@ai-sdk/openai";

const LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";
const LOVABLE_GATEWAY_BASE = "https://ai.gateway.lovable.dev";
const AMS_TRIAGE_MODEL = "openai/gpt-6-astra";

function createLovableAiGatewayRunIdFetch(initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;
  return {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER)) {
        headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
      }
      const response = await fetch(input, { ...init, headers });
      runId ??= response.headers.get(LOVABLE_AIG_RUN_ID_HEADER)?.trim() || undefined;
      return response;
    },
    getRunId: () => runId,
  };
}

export function createAmsGatewayModel() {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("Lovable AI is not configured for this workspace");
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: `${LOVABLE_GATEWAY_BASE}/v1`,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  return {
    model: provider.responses(AMS_TRIAGE_MODEL),
    runIdFetch,
  };
}

/** Map gateway failures to a safe, actionable user message. */
export function friendlyGatewayError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  const status = (err as { statusCode?: number }).statusCode;
  if (status === 402 || /insufficient|credits/i.test(raw)) {
    return "AI credits are exhausted for this workspace. Top up credits to keep using triage.";
  }
  if (status === 403) {
    return "AI access was denied for this workspace. An admin needs to enable it before triage works.";
  }
  if (status === 429 || /rate.?limit/i.test(raw)) {
    return "The AI assistant is rate limited right now. Try again in a moment.";
  }
  if (status === 401) {
    return "Lovable AI is not configured. Ask an admin to provision the AI key.";
  }
  return "The AI assistant could not complete this request. You can still triage the ticket manually.";
}
