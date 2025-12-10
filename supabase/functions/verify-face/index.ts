import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { providerId, idDocumentUrl, selfieUrl } = await req.json();

    if (!providerId || !idDocumentUrl || !selfieUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: providerId, idDocumentUrl, selfieUrl" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    console.log(`Verifying face for provider: ${providerId}`);
    console.log(`ID Document URL: ${idDocumentUrl}`);
    console.log(`Selfie URL: ${selfieUrl}`);

    // Use Gemini to compare the two images
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert identity verification AI. Your task is to compare a face from an ID document with a selfie photo to determine if they are the same person.

Analyze both images carefully and determine:
1. Whether both images clearly show a face
2. Whether the faces appear to be of the same person
3. Your confidence level in the match

Respond with a JSON object in this exact format:
{
  "match": true/false,
  "confidence": "high" | "medium" | "low",
  "reason": "Brief explanation of your assessment",
  "idFaceDetected": true/false,
  "selfieFaceDetected": true/false
}

Be thorough but not overly strict - account for differences in lighting, angle, and image quality.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please compare the face in the ID document (first image) with the selfie (second image) and determine if they are the same person."
              },
              {
                type: "image_url",
                image_url: { url: idDocumentUrl }
              },
              {
                type: "image_url",
                image_url: { url: selfieUrl }
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    console.log("AI Response:", content);

    // Parse the AI response
    let verificationResult;
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        verificationResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      verificationResult = {
        match: false,
        confidence: "low",
        reason: "Could not process verification result",
        idFaceDetected: false,
        selfieFaceDetected: false
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        providerId,
        verification: verificationResult
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Verification error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Verification failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
