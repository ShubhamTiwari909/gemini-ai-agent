import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  const data = await req.json();
  const prompt = data.text || "Explain how AI works";

  const result = await model.generateContent(prompt);
  return new Response(
    JSON.stringify({
      summary: result.response.text(),
    }),
  );
}
