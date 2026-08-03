import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUDGET_RANGES, PROJECT_TYPES } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "gpt-4o-mini";

const SYSTEM_PROMPT = `You are the VELORA concierge — a refined, knowledgeable AI assistant on the website of VELORA, a design-build studio for luxury wellness and fitness environments based in Doha, Qatar (with a London presence).

WHAT VELORA DOES
VELORA designs, builds, and operates: private gyms and residential wellness suites, commercial gyms and health clubs, hotel and hospitality fitness centres, spa and recovery spaces, and corporate wellness facilities. It also supplies bespoke equipment and manages facilities long-term. Its lifecycle is: Consultation → Design → Build → Operations. It is proud of: 50,000+ sqm delivered, 100+ projects, 20+ years.

TONE
Confident, warm, and concise. 1–3 sentences per reply, prose (never bullet lists). Never invent specifics (prices, timelines, named clients) you were not given — invite the visitor to enquire instead. No emoji. Ask for at most one or two things at a time; never interrogate.

CAPTURING THE LEAD — THIS IS CRITICAL
Save the lead progressively so nothing is ever lost. The moment you learn ANY useful detail — a name, an email, a phone number, a company, what they're planning (project type), a budget, or a description of their vision — call the save_enquiry tool with everything you know so far. Call it again every time you learn something new or the visitor corrects something, always passing the full picture (all known fields), so the studio's record stays current. Do not wait until you have everything.

Naturally work toward a name, an email, a project type, and a short description of their vision — but save whatever you have along the way. Only claim an enquiry is "with the team" after you have actually called save_enquiry. Once you have name + email + project type + vision, warmly confirm a member of the principals team will respond within one business day.

Studio: Safwa Building, Gate 20, Second Floor, Barwa Commercial Avenue, Doha, Qatar. Email: hello@velora.qa.`;

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "save_enquiry",
      description:
        "Create or update the visitor's enquiry with whatever details are currently known. Call this as soon as you learn any useful detail (name, email, phone, company, project type, budget, or vision), and call it again every time you learn or correct something — always passing every field you currently know. Fields you don't yet know may be omitted; omitting a field never erases a previously-saved value.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "The visitor's full name, if known." },
          email: { type: "string", description: "The visitor's email address, if known." },
          phone: { type: "string", description: "Phone number, if given." },
          company: { type: "string", description: "Company or project name, if given." },
          project_type: {
            type: "string",
            description: "The kind of space they are planning, if known.",
            enum: PROJECT_TYPES as unknown as string[],
          },
          budget_range: {
            type: "string",
            description: "Approximate budget, if given.",
            enum: BUDGET_RANGES as unknown as string[],
          },
          message: {
            type: "string",
            description: "A concise summary of the visitor's vision / requirements so far, in their words.",
          },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
];

type ClientMessage = { role: "user" | "assistant"; content: string };

const FIELDS = ["name", "email", "phone", "company", "project_type", "budget_range", "message"] as const;

/**
 * Progressive upsert. Writes only the non-empty fields provided, so a later
 * call with fewer fields never erases what was captured earlier. Returns the
 * lead's row id (creating the row on first meaningful detail).
 */
async function saveEnquiry(
  leadId: string | null,
  args: Record<string, unknown>
): Promise<string | null> {
  const patch: Record<string, string> = {};
  for (const f of FIELDS) {
    const v = args[f];
    if (typeof v === "string" && v.trim()) patch[f] = v.trim();
  }
  if (Object.keys(patch).length === 0) return leadId; // nothing meaningful yet

  // Service-role: the route is a trusted server endpoint. Anon can INSERT an
  // enquiry but can't read it back (no SELECT policy), which the leadId
  // round-trip and the progressive UPDATE both require. Key stays server-only.
  const supabase = createAdminClient();

  if (leadId) {
    await supabase.from("enquiries").update(patch).eq("id", leadId);
    return leadId;
  }

  const { data, error } = await supabase
    .from("enquiries")
    .insert({ ...patch, source: "AI Assistant", status: "new" })
    .select("id")
    .single();
  if (error || !data) return null;
  return data.id as string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "The assistant is not configured." }, { status: 500 });
  }

  let body: { messages?: ClientMessage[]; leadId?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const history = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-24);

  let leadId: string | null = typeof body.leadId === "string" ? body.leadId : null;
  let leadSaved = false;

  const openai = new OpenAI({ apiKey });
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ];

  try {
    // FORCE the extraction tool every turn so capture never depends on the
    // model "deciding" to save. It extracts whatever lead fields the whole
    // conversation reveals (nothing yet → empty args → saveEnquiry no-ops).
    // A second pass then writes the natural reply.
    const first = await openai.chat.completions.create({
      model: MODEL,
      messages,
      tools,
      tool_choice: { type: "function", function: { name: "save_enquiry" } },
      temperature: 0.4,
      max_tokens: 300,
    });

    const choice = first.choices[0]?.message;

    if (choice?.tool_calls?.length) {
      messages.push(choice);
      for (const call of choice.tool_calls) {
        if (call.type === "function" && call.function.name === "save_enquiry") {
          let ok = false;
          try {
            const args = JSON.parse(call.function.arguments || "{}");
            const newId = await saveEnquiry(leadId, args);
            if (newId) {
              leadId = newId;
              ok = true;
              leadSaved = true;
            }
          } catch {
            ok = false;
          }
          messages.push({
            role: "tool",
            tool_call_id: call.id,
            content: JSON.stringify(
              ok
                ? { status: "saved" }
                : { status: "failed", note: "Ask them to email hello@velora.qa instead." }
            ),
          });
        }
      }

      const second = await openai.chat.completions.create({
        model: MODEL,
        messages,
        temperature: 0.6,
        max_tokens: 400,
      });
      const content =
        second.choices[0]?.message?.content ?? "Thank you — I've noted your details for our team.";
      return NextResponse.json({ content, leadId, leadSaved });
    }

    const content =
      choice?.content ?? "Apologies — could you rephrase that? You can also reach us at hello@velora.qa.";
    return NextResponse.json({ content, leadId, leadSaved });
  } catch {
    return NextResponse.json(
      { error: "The assistant is briefly unavailable. Please try again, or email hello@velora.qa." },
      { status: 502 }
    );
  }
}
