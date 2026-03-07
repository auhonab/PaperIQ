import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
    try {
        const { pdfBase64, imageBase64, imageMimeType, question, history } = await req.json();

        if (!pdfBase64 && !imageBase64) {
            return NextResponse.json({ error: "Missing PDF or image context" }, { status: 400 });
        }
        if (!question) {
            return NextResponse.json({ error: "Missing question" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Build history
        const geminiHistory = [];

        // 1. Initial instruction with PDF or Image
        const initialParts = [];
        
        if (pdfBase64) {
            initialParts.push({ inlineData: { data: pdfBase64, mimeType: "application/pdf" } });
            initialParts.push({ text: "I will ask you questions about this research paper. Answer clearly, cite specific sections when relevant, keep answers under 150 words unless more is genuinely needed, never start with 'Great question' or 'Certainly', just answer directly." });
        } else if (imageBase64) {
            initialParts.push({ inlineData: { data: imageBase64, mimeType: imageMimeType || "image/jpeg" } });
            initialParts.push({ text: "I will ask you questions about this image. Answer clearly and describe what you see when relevant, keep answers under 150 words unless more is genuinely needed, never start with 'Great question' or 'Certainly', just answer directly." });
        }

        geminiHistory.push({
            role: 'user',
            parts: initialParts
        });

        // 2. Initial model acknowledgement
        geminiHistory.push({
            role: 'model',
            parts: [{ text: pdfBase64 ? "Understood. I have read the paper and am ready to answer your questions." : "Understood. I have analyzed the image and am ready to answer your questions." }]
        });

        // 3. Append existing conversation history
        if (history && Array.isArray(history)) {
            for (const item of history) {
                // history consists of { role, text } where role is 'user' or 'model'
                geminiHistory.push({
                    role: item.role,
                    parts: [{ text: item.text }]
                });
            }
        }

        const chat = model.startChat({
            history: geminiHistory,
        });

        const result = await chat.sendMessage(question);
        const response = await result.response;

        return NextResponse.json({ answer: response.text() });

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
