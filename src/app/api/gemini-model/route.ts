import { GoogleGenerativeAI } from "@google/generative-ai";
import csrf from "csrf";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  tools: [
    {
      codeExecution: {},
    },
  ],
});

const tokens = new csrf();
const secret = process.env.CSRF_SECRET || tokens.secretSync();

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
  const result = await model.generateContent(prompt);

  /**
   * Return the generated content as a JSON response.
   */
  return new Response(
    JSON.stringify({
      summary: result.response.text(),
    }),
  );
}
