const express = require('express');
const app = express();
const PORT = 3000;

function mymiddleware1(req, res, next) {
    console.log('첫번째 미들웨어');
    next();
}

function mymiddleware2(req, res, next) {
    console.log('2번째 미들웨어');
    next();
}

function mymiddleware3(req, res, next) {
    console.log('3번째 미들웨어');
    next();
}

function mymiddleware4(req, res, next) {
    console.log('4번째 미들웨어');
    next();
}

app.use(mymiddleware1);

app.get('/', (req, res) => {
    console.log(`사용자가 왔음.. 누가?? ${req.socket.remoteAddress}`);
    res.send('<h1>안녕</h1>');
});

app.get('/middle', mymiddleware2, mymiddleware3, (req, res) => {
    console.log(`최종 라우트 도달`);
    res.send('<h1>미들웨어 라우트</h1>')
})

app.get('/last', mymiddleware4, (req, res) => {
    console.log(`최종 라스트 라우트 도달`);
    res.send('<h1>라스트 라우트</h1>')
})

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행중입니다. `);
});