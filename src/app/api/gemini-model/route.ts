import { GoogleGenAI } from "@google/genai";
import csrf from "csrf";
import { NextResponse } from "next/server";

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API || "" });

const tokens = new csrf();
const secret = process.env.CSRF_SECRET || tokens.secretSync();

// Define the grounding tool
const groundingTool = {
  googleSearch: {},
};

// Configure generation settings
const config = {
  tools: [groundingTool],
};

/**
 * API route for generating content using Gemini AI model.
 */
export async function POST(req: Request): Promise<Response> {
  /**
   * Get the prompt from the request body.
   */
  const data = await req.json();
  const prompt = data.text || "Explain how AI works";
  const token = data.csrfToken || "";

  // Validate CSRF token
  if (!tokens.verify(secret, token)) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  /**
   * Use the Gemini AI model to generate content from the prompt.
   */
  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config,
  });

  /**
   * Return the generated content as a JSON response.
   */
  return new Response(
    JSON.stringify({
      summary: prompt.includes("image")
        ? await generateImage({ prompt })
        : result.text,
    }),
  );
}

async function generateImage({ prompt }: { prompt: string }) {
  try {
    // Set responseModalities to include "Image" so the model can generate  an image
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: prompt,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });
    if (response && response.candidates) {
      for (const part of response?.candidates[0]?.content?.parts ?? []) {
        // Based on the part type, either show the text or save the image
        if (part.inlineData && part.inlineData.data) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          const imageUrl = `data:image/png;base64,${buffer.toString("base64")}`;
          return imageUrl;
        }
      }
    } else {
      // Handle the case where response or response.candidates is null or undefined
      return null;
    }
  } catch (error) {
    console.error("Error generating content:", error);
    return error;
  }
}
