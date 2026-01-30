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
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const {
      leadName,
      leadPosition,
      leadCompany,
      leadRequirement,
      leadLinkedIn,
      leadWebsite,
      tone,
      companyInfo,
    }: GenerateEmailRequest = await req.json();

    // Build context about the company
    const companyContext = companyInfo.companyName
      ? `
YOUR COMPANY CONTEXT:
- Company: ${companyInfo.companyName}
- What we do: ${companyInfo.description || "Not specified"}
- Value proposition: ${companyInfo.valueProposition || "Not specified"}
- Target audience: ${companyInfo.targetAudience || "Not specified"}
- Key benefits: ${companyInfo.keyBenefits || "Not specified"}
`
      : "";

    // Build lead context
    const leadContext = `
LEAD INFORMATION:
- Name: ${leadName}
- Position: ${leadPosition}
${leadCompany ? `- Company: ${leadCompany}` : ""}
- Context/Requirement: ${leadRequirement}
${leadLinkedIn ? `- LinkedIn: ${leadLinkedIn}` : ""}
${leadWebsite ? `- Website: ${leadWebsite}` : ""}
`;

    const systemPrompt = `You are an expert cold email copywriter for B2B SaaS sales. Your job is to write highly personalized, non-spammy cold emails that book meetings.

STRICT RULES:
1. Maximum 90 words in the email body
2. NO corporate fluff or buzzwords (no "synergy", "leverage", "innovative", "cutting-edge", etc.)
3. NO exclamation marks ever
4. Sound human, not like a sales robot
5. Use curiosity-driven soft CTAs (e.g., "Worth a quick chat?" or "Curious if this resonates?")
6. Reference specific details about the lead's situation
7. Focus on ONE clear value proposition
8. Write like a peer, not a vendor
9. Keep subject lines under 50 characters, intriguing but not clickbait

${companyContext}

Generate a JSON response with this exact structure:
{
  "subject": "the subject line",
  "body": "the email body with {{name}} placeholder for personalization"
}`;

    const userPrompt = `Write a ${tone} cold email for this lead:
${leadContext}

Remember: Max 90 words, no fluff, no exclamation marks, curiosity-driven CTA.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to generate email" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response from the AI
    let emailData;
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        emailData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Fallback: try to extract subject and body manually
      emailData = {
        subject: "Quick question",
        body: content,
      };
    }

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
