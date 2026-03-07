import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
    try {
        const body = await req.json();
        const { imageBase64, imageMimeType, pdfBase64 } = body;

        if (!imageBase64 || !imageMimeType) {
            return NextResponse.json({ error: "Missing image data" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are ScholarSight, a specialist in explaining research visuals to people who find them confusing.
Explain this visual clearly in plain English.

IMPORTANT: Respond ONLY with valid JSON. Do NOT include any text before or after the JSON object. Do NOT use markdown code blocks.

Return this exact JSON structure:
{
  "visualType": "one of: Bar Chart | Line Graph | Scatter Plot | Table | Architecture Diagram | Equation | Heatmap | Confusion Matrix | Flowchart | Other",
  "headline": "one sentence — the single most important thing this visual shows",
  "plainExplanation": "2-3 paragraphs: (1) what you are looking at, (2) what axes/columns/symbols mean, (3) what pattern or conclusion to draw",
  "keyInsights": ["3 insights as complete plain-English sentences, ordered most to least important"],
  "whatToLookFor": "the one element or trend a reader is most likely to miss, and exactly why it matters",
  "connectionToThesis": "how this visual supports the paper's main argument — or null if no paper PDF was provided",
  "commonMisreading": "one way readers commonly misinterpret this type of visual, and why that reading is wrong here"
}
Rules:
- Always explain what axes or columns represent before interpreting what the data shows
- For equations: explain each symbol before explaining the equation as a whole
- For tables: explain rows and columns before describing what the numbers mean
- Never say 'as shown in the figure' — describe it directly
- If the image resolution is too low to read clearly, say so in the headline and do your best
- CRITICAL: Return ONLY the JSON object, nothing else`;

        const parts = [prompt];

        if (pdfBase64) {
            parts.push({
                inlineData: {
                    data: pdfBase64,
                    mimeType: "application/pdf"
                }
            });
        }

        parts.push({
            inlineData: {
                data: imageBase64,
                mimeType: imageMimeType
            }
        });

        const result = await model.generateContent(parts);
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
        console.error("ScholarSight API Error:", error);
        return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
    }
}
