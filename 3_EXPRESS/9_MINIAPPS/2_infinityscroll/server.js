const express = require('express');

// 가상 데이터 생성
const data = Array.from({ length: 100 }, (_, i) => `Item ${i}`);
// console.log(data);

const app = express();
const PORT = 3000;

app.use(express.json());

// 미들웨어 추가
app.use(express.static('public'));

// 0. 미들웨어로 [시간] [METHOD] [URL-Path]를 찍어보기
function myLogger(req, res, next) { // 입력 인자를 채워넣고
    const time = new Date().toString();
    const method = req.method;
    const urlPath = req.url;
    console.log(`[${time}] [${method}] [${urlPath}]`);
    next();
}

app.use(myLogger);

// /api.items?start=5&end=10
app.post('/api/items', (req, res) => {
    // 1. 변수 선언, 사용자의 입력 받아오기
    const { start, end } = req.body;
    console.log(start, end);

    // 2. 이 번호에 해당하는 걸 배열에서 골라내기
    const resultData = data.slice(Number(start), Number(end) + 1);

    //3. 그 내용 전달하기
    res.json(resultData);
})

app.listen(PORT, () => {
    console.log(`Server is up on http://127.0.0.1:${PORT}`);
});