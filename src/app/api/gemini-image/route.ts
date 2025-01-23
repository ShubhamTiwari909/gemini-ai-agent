import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * API route for generating content using Gemini AI model.
 */
export async function POST(req: Request): Promise<Response> {
  /**
   * Get the prompt from the request body.
   */
  const data = await req.json();
  const { image, mimeType } = data;

  if (!image || !mimeType) {
    return new Response(JSON.stringify({ error: "Invalid image data" }), {
      status: 400,
    });
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
    "Describe this image in detail and suggest some captions",
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
