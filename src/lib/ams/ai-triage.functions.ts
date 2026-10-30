import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const triageSuggestionSchema = z.object({
  summary: z.string(),
  category: z.string().nullable(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  confidence: z.number().min(0).max(1),
  rationale: z.string(),
});

export type TriageSuggestion = z.infer<typeof triageSuggestionSchema>;

const TRIAGE_SYSTEM = `You are the triage assistant inside AMS Manager, an enterprise support
console. Given a new support ticket, produce:
1. summary — a crisp 1-2 sentence restatement of the issue for the support queue.
2. category — the best short category label (for example Billing, Bug, Onboarding,
   Integration, Performance, Account, Feature Request, Data, Security). Use null only
   when the text is truly unclassifiable.
3. priority — one of low, medium, high, critical. Critical means production is down,
   data loss or security impact; low means cosmetic or a question.
4. confidence — 0 to 1.
5. rationale — one short sentence explaining the priority choice.`;

export const suggestTicketTriage = createServerFn({ method: "POST" })
  .inputValidator(
    (d: { subject: string; description?: string; product?: string }) => d,
  )
  .handler(async ({ data }) => {
    if (!data.subject?.trim()) throw new Error("Subject is required");

    const { createAmsGatewayModel, friendlyGatewayError } = await import(
      "./gateway.server"
    );

    try {
      const { Output, streamText } = await import("ai");
      const { model } = createAmsGatewayModel();
      const output = Output.object({ schema: triageSuggestionSchema });

      const result = streamText({
        model,
        system: TRIAGE_SYSTEM,
        messages: [
          {
            role: "user",
            content: [
              `Subject: ${data.subject.trim()}`,
              data.description?.trim() ? `Description: ${data.description.trim()}` : null,
              data.product?.trim() ? `Product: ${data.product.trim()}` : null,
            ]
              .filter(Boolean)
              .join("\n"),
          },
        ],
        output,
        providerOptions: {
          openai: {
            store: false,
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            include: ["reasoning.encrypted_content"],
          },
        },
      });

      let parsed: TriageSuggestion | undefined;
      for await (const partial of result.partialOutputStream) {
        if (partial && typeof partial === "object") parsed = partial as TriageSuggestion;
      }
      if (!parsed) throw new Error("The assistant returned no suggestion");
      return parsed;
    } catch (err) {
      throw new Error(friendlyGatewayError(err));
    }
  });
