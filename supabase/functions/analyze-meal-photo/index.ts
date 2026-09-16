const FOOD_ANALYSIS_PROMPT = `Identify each distinct food in this photo. Estimate portion size from visual cues (plate size, utensils, container).
Return ONLY valid JSON:

{
  "items": [
    {
      "food_name": string,
      "serving_size": number,
      "serving_unit": string,
      "calories": number,
      "protein": number,
      "carbs": number,
      "fats": number,
      "confidence": "low" | "medium" | "high",
      "category": "protein" | "carbs" | "fats" | "vegetables" | "fruits" | "dairy" | "snacks" | "drinks" | "other"
    }
  ]
}

Rules:
- One object per visible food item. Do not merge a mixed plate into a single entry.
- Macros must reflect the estimated portion in the photo, not per 100g.
- Always return at least one item if food is visible.
- Never omit numeric fields; use your best estimate.
- Pick the closest category for each item.`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const DAILY_LIMIT = 20;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      return json({ error: "Missing Supabase env" }, 500);
    }
    if (!openaiKey) {
      return json({ error: "Missing OPENAI_API_KEY" }, 500);
    }

    const { createClient } = await import(
      "https://esm.sh/@supabase/supabase-js@2"
    );
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return json({ error: "Unauthorized" }, 401);
    }

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("api_usage")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("action", "analyze-meal-photo")
      .gte("created_at", since);

    if ((count ?? 0) >= DAILY_LIMIT) {
      return json({ error: "Daily photo analysis limit reached" }, 429);
    }

    const body = await req.json();
    const imageBase64 = body?.image_base64;
    const mediaType = body?.media_type || "image/jpeg";
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return json({ error: "image_base64 is required" }, 400);
    }

    await supabase.from("api_usage").insert({
      user_id: user.id,
      action: "analyze-meal-photo",
    });

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 800,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: FOOD_ANALYSIS_PROMPT },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mediaType};base64,${imageBase64}`,
                  detail: "low",
                },
              },
            ],
          },
        ],
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error", errText);
      return json({ error: "Vision analysis failed" }, 502);
    }

    const openaiJson = await openaiRes.json();
    const text = openaiJson?.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(text);

    return json(parsed, 200);
  } catch (error) {
    console.error(error);
    return json({ error: "Unexpected error" }, 500);
  }
});

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
}
