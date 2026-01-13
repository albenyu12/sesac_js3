// npm i @google/genai
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ quiet: true });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function ask_question(question) {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', 
        // model: 'gemini-3-flash-preview', 
        contents: question
    })

    console.log(response.text);
}

ask_question('인공지능이 무엇인지 3문장을 개조식으로 작성하시오. ');
// ask_question('첫번째 문장에 대해 더 상세히 설명해줘.  ');