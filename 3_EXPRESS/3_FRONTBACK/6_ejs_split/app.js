// npm i ejs

const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.get('/main', (req, res) => {
    const data = {
        title: '내 타이틀2', message: '분할된 헤더와 메인 합치기'
    }
    
    res.render(data);
});

app.get('/user', (req, res) => {
    const data = {
        title: '사용자 페이지', message: '분할된 헤더와 또다른 메인 합치기'
    }

    res.render(data);
});

app.listen(PORT, () => {
    console.log('서버레디');
});