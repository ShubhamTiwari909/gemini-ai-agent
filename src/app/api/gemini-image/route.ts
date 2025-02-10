import { GoogleGenerativeAI } from "@google/generative-ai";

import csrf from "csrf";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

const tokens = new csrf();
const secret = process.env.CSRF_SECRET || tokens.secretSync();

const commonCodePrompt =
  "Explain this code and do the code review by giving suggestions";

const mimeTypePrompt = {
  image: "Describe this image in detail and suggest some captions",
  pdf: "Summarize this document",
  "text/html": commonCodePrompt,
  "text/css": commonCodePrompt,
  "text/javascript": commonCodePrompt,
  "text/typescript": commonCodePrompt,
  "text/python": commonCodePrompt,
};

/**
 * API route for generating content using Gemini AI model.
 */
export async function POST(req: Request): Promise<Response> {
  /**
   * Get the prompt from the request body.
   */
  const data = await req.json();
  const { image, mimeType, csrfToken } = data;

  // Validate CSRF token
  if (!tokens.verify(secret, csrfToken)) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  if (!image || !mimeType) {
    return new Response(JSON.stringify({ error: "Invalid image data" }), {
      status: 400,
    });
  }

  let revampedMimeType = mimeType;

  if (mimeType.includes("application")) {
    revampedMimeType = mimeType.replace("application/", "");
  }
  if (mimeType.includes("image")) {
    revampedMimeType = "image";
  }

  /**
   * Use the Gemini AI model to generate content from the prompt.
   */
  const result = await model.generateContent([
    {
      inlineData: {
        data: image,
        mimeType: mimeType,
      },
    },
    mimeTypePrompt[revampedMimeType as keyof typeof mimeTypePrompt],
  ]);
  /**
   * Return the generated content as a JSON response.
   */
  return new Response(
    JSON.stringify({
      summary: result.response.text(),
    }),
  );
}
