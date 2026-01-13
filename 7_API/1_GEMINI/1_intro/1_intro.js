// npm i dotenv
// const dotenv = require('dotenv');
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;

async function make_request(question) {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

    const body = {
        contents: [{ parts: [{ text: question }]}]
    }

    const res = await fetch(url, {
       method: 'POST',
       headers: {
        'x-goog-api-key': key, 
        'Content-Type': 'application/json'
       }, 
       body: JSON.stringify(body),
    });

    const data = await res.json();
    // console.log(data);
    const text = data.candidates[0].content.parts[0].text;
    console.log(text);
}

make_request('JavaScript를 배우기위한 방법을 1줄로 설명해줘. ');
make_request('오늘 저녁 메뉴 추천 1줄로 답변해줘. ');