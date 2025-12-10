// npm i ejs

const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // res.render('index', { title: '익스프레스 앱', message: 'EJS를 사용해서 서버사이드 렌더링을 합니다' });
    res.render('index', { title: '익스프레스 앱', message: '내가 쓰고 싶은 메시지' });
});

app.get('/fruits', (req, res) => {
    const fruits = ['사과', '바나나', '오렌지', '포도'];
    res.render('fruits', { fruits: fruits });
});

app.get('/welcome', (req, res) => {
    const isAdmin = false;

    if (isAdmin) {
        username = "관리자";
    } else {
        username = "홍길동";
    }
    res.removeHeader( 'welcome', { username });
});

app.listen(PORT, () => {
    console.log('서버레디');
});