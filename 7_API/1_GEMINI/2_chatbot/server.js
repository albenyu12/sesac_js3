import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import morgan from 'morgan';

dotenv.config({ quiet: true });

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let history = []; // 데모용 저장소

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    history.push({ role: 'user', parts: [{ text: message }]});
    history = history.slice(-20);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: message
        })
        
        const reply = response.text;

        history.push({ role: 'model', parts: [{ text: reply }]});

        res.json({ reply });
    } catch (err) {
        res.status(500).json({ error: '알 수 없는 오류..' });
    }


    console.log(response.text);
})

app.listen(3000 , () => {
    console.log("서버레디..");
})