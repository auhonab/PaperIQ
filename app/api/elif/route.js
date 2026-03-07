import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
    try {
        const { pdfBase64, level } = await req.json();

        if (!pdfBase64) {
            return NextResponse.json({ error: "Missing PDF data" }, { status: 400 });
        }
        if (!level) {
            return NextResponse.json({ error: "Missing audience level" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are PaperIQ, an expert at making dense academic research accessible to anyone.
Audience level: ${level} where:
- highschool = curious 16-year-old, zero jargon, use everyday analogies like sports or social media
- undergrad = first-year university student, explain technical terms immediately when used
- recruiter = non-technical executive, focus entirely on business impact and what is novel
- expert = PhD researcher, be precise, preserve nuance, focus on methodology and limitations

IMPORTANT: Respond ONLY with valid JSON. Do NOT include any text before or after the JSON object. Do NOT use markdown code blocks.

Return this exact JSON structure:
{
  "title": "the paper's full title",
  "oneLiner": "one sentence core idea as a concrete analogy appropriate for the audience level",
  "summary": "3-4 paragraphs explaining what the paper does, how, and what was found — written for the chosen audience",
  "keyContributions": ["3-5 complete sentences on what is genuinely new or novel"],
  "jargonGlossary": [{ "term": "technical term from the paper", "plain": "1-2 sentence explanation for chosen audience" }],
  "whyItMatters": "1-2 sentences on real-world impact or why someone outside academia should care",
  "limitations": "1 paragraph on what the paper does not prove, what assumptions it makes, or where it might fail"
}
Rules:
- Return EXACTLY 5 items in jargonGlossary — no more, no less
- Do NOT copy sentences from the abstract — rephrase everything
- Match the complexity of ALL text to the audience level including the glossary
- oneLiner must use a concrete analogy, not an abstract description
- CRITICAL: Return ONLY the JSON object, nothing else`;

        const pdfPart = {
            inlineData: {
                data: pdfBase64,
                mimeType: "application/pdf"
            }
        };

        const result = await model.generateContent([prompt, pdfPart]);
        const response = await result.response;
        const text = response.text();

        console.log('Raw AI response:', text.substring(0, 200) + '...');

        // Strip markdown fences and extract JSON
        let cleanJson = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        // Find the first { and last } to extract only the JSON object
        const firstBrace = cleanJson.indexOf('{');
        const lastBrace = cleanJson.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
        }

        // Parse JSON with error handling
        let parsedData;
        try {
            parsedData = JSON.parse(cleanJson);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError.message);
            console.error('Attempted to parse:', cleanJson.substring(0, 500));
            throw new Error('Analysis Failed: Received invalid response format. Please try again.');
        }

        return NextResponse.json(parsedData);

    } catch (error) {
        console.error("ELIF API Error:", error);
        return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
    }
}
