import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface GenerateEmailRequest {
  leadName: string;
  leadPosition: string;
  leadCompany?: string;
  leadRequirement: string;
  leadLinkedIn?: string;
  leadWebsite?: string;
  tone: string;
  companyInfo: {
    companyName?: string;
    description?: string;
    valueProposition?: string;
    targetAudience?: string;
    keyBenefits?: string;
  };
  provider?: 'claude' | 'openai' | 'lovable';
}

// Import the refined prompt templates
const emailTemplates = {
  cmo_bot_context: {
    forbidden_words: [
      "synergy", "leverage", "innovative", "cutting-edge", "revolutionary",
      "game-changing", "disruptive", "next-generation"
    ],
    writing_principles: {
      tone: "Professional yet conversational, peer-to-peer communication",
      style: "Direct, value-focused, no corporate jargon",
    }
  },
  cold_email_writer: {
    body: { max_words: 90 },
    structure: {
      subject_line: { max_chars: 50 },
      cta: {
        style: "Soft, low-pressure, curiosity-driven",
        examples: [
          "Worth a quick chat?",
          "Curious if this resonates?",
          "Open to exploring this?",
        ]
      }
    }
  },
  tone_variations: {
    professional: { characteristics: "Respectful, data-driven, strategic focus" },
    casual: { characteristics: "Conversational, authentic, peer-to-peer" },
    friendly: { characteristics: "Empathetic, collaborative, solution-oriented" },
    direct: { characteristics: "Concise, clear, efficiency-focused" }
  }
};

/**
 * Build optimized system prompt with research-based personalization
 */
function buildSystemPrompt(companyInfo?: GenerateEmailRequest['companyInfo']): string {
  const corePrinciples = `You are an elite AI SDR writing personalized cold emails based on genuine research.

YOUR CORE APPROACH:
- Write as if you spent 10+ minutes researching the recipient
- Reference specific details from their website or LinkedIn that show real attention
- Sound like a peer who understands their business, not a salesperson
- Every detail must come from their actual role, company, or visible projects
- Build credibility through specificity, not flattery

WRITING RULES:
- Max 90 words
- Subject line: max 50 chars
- One specific observation that proves you researched them
- Clear connection between their situation and what you offer
- Soft, confident CTA that assumes relevance

FORBIDDEN - NEVER USE:
- "I noticed you're hiring" (too generic)
- "We help companies like yours" (vague)
- "Happy to chat" (desperate)
- "Let me know if interested" (weak)
- Exclamation marks, emojis, or hype language
- Agency speak: "synergy", "leverage", "innovative", "cutting-edge"

CTA EXAMPLES THAT WORK:
- "Worth a 15-minute conversation?"
- "Curious if this approach makes sense for your situation?"
- "Open to exploring how we've helped similar teams?"

RESEARCH SIGNALS:
- Reference something from their LinkedIn profile (recent hire, post, company move)
- Mention specific product/feature you saw on their website
- Connect to their job description or visible goals
- Show understanding of their industry challenges
- Demonstrate you know what they're actually working on`;

  const companyContext = companyInfo?.companyName
    ? `\n\nYOUR COMPANY (Use this for context, don't hard-sell):
- Name: ${companyInfo.companyName}
- What we do: ${companyInfo.description || 'Not specified'}
- Value prop: ${companyInfo.valueProposition || 'Not specified'} (Make this THEIR benefit, not our feature)
- Target: ${companyInfo.targetAudience || 'Not specified'}
- How we help: ${companyInfo.keyBenefits || 'Not specified'}`
    : '';

  return `${corePrinciples}${companyContext}

OUTPUT FORMAT (JSON ONLY - NO MARKDOWN):
{
  "subject": "subject line here (shows you researched them)",
  "body": "email body with {{name}} placeholder for first name only"
}`;
}

/**
 * Build user prompt with research signals and context
 */
function buildUserPrompt(request: GenerateEmailRequest): string {
  const toneDesc = emailTemplates.tone_variations[request.tone as keyof typeof emailTemplates.tone_variations]?.characteristics || 'professional';

  // Build research context - this is what signals "I did my homework"
  let researchContext = '';
  
  if (request.leadWebsite) {
    researchContext += `\nVISITED THEIR WEBSITE: ${request.leadWebsite}`;
  }
  
  if (request.leadLinkedIn) {
    researchContext += `\nVISITED THEIR LINKEDIN: ${request.leadLinkedIn}`;
  }

  const prompt = `Write a ${request.tone} cold email (${toneDesc}) for someone you genuinely researched.

ABOUT THE RECIPIENT:
- Name: {{name}} (first name only, use placeholder)
- Role: ${request.leadPosition}
${request.leadCompany ? `- Company: ${request.leadCompany}` : ''}
- What they're working on: ${request.leadRequirement}
${researchContext}

YOUR TASK:
1. Use research details from their website/LinkedIn to show you actually know them
2. Reference something specific they're doing (new hire, visible goal, product feature, etc.)
3. Connect their situation to YOUR value prop (what makes YOUR company relevant to THEIR role)
4. Be conversational and warm, but respect their time
5. Make them feel like this wasn't a mass email

REQUIRED:
- Max 90 words
- One clear observation that proves you researched
- One specific problem they likely face in their role
- One reason YOUR company helps with that problem
- Soft CTA (not "let me know if interested")
- Zero hype language

REMEMBER: Sound like a peer who did homework, not a salesperson running a script.`;

  return prompt;
}

/**
 * Call AI provider
 */
async function callAIProvider(
  provider: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  switch (provider) {
    case 'claude':
      return callClaude(messages, systemPrompt);
    case 'openai':
      return callOpenAI(messages);
    case 'lovable':
    default:
      return callLovable(messages);
  }
}

async function callClaude(messages: any[], systemPrompt: string): Promise<string> {
  const apiKey = Deno.env.get("CLAUDE_API_KEY");
  if (!apiKey) throw new Error("CLAUDE_API_KEY not configured");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages.filter((m: any) => m.role !== 'system'),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Claude API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function callOpenAI(messages: any[]): Promise<string> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callLovable(messages: any[]): Promise<string> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a moment.");
    }
    if (response.status === 402) {
      throw new Error("AI credits depleted. Please add funds to continue.");
    }
    throw new Error(`Lovable API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

/**
 * Parse AI response
 */
function parseEmailResponse(content: string): { subject: string; body: string } {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        subject: parsed.subject || "Quick question",
        body: parsed.body || content,
      };
    }
  } catch (error) {
    console.error("Failed to parse JSON:", error);
  }

  return {
    subject: "Quick question",
    body: content,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: GenerateEmailRequest = await req.json();
    const provider = request.provider || 'lovable';

    // Build prompts using refined templates
    const systemPrompt = buildSystemPrompt(request.companyInfo);
    const userPrompt = buildUserPrompt(request);

    // Call AI provider
    const content = await callAIProvider(provider, systemPrompt, userPrompt);

    // Parse response
    const emailData = parseEmailResponse(content);

    return new Response(JSON.stringify(emailData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-email error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
