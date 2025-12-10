// npm i ejs

const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // res.render('index', { title: '익스프레스 앱', message: 'EJS를 사용해서 서버사이드 렌더링을 합니다' });
    res.render('index', { title: '익스프레스 앱', message: 'EJS를 사용해서 서버사이드 렌더링을 합니다' });
});

app.listen(PORT, () => {
    console.log('서버레디');
});