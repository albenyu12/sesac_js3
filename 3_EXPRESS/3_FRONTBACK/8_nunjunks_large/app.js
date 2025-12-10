// npm i nunjucks
const express = require('express');
const nunjucks = require('nunjucks');

const app = express();

const PORT = 3000;

app.set('view engine', 'njk');

nunjucks.configure('views', {
    autoescape: true, 
    express: app, 
    watch: true // 개발용으로, 템플릿 파일의 변경을 알아서 감지해줌
});

app.get('/', (req, res) => {
    res.render('index', { title: '익스프레스 앱', message: 'NJK를 사용해서 렌더링' })
})

app.get('/fruits', (req, res) => {
    const fruits = ['사과', '바나나', '오렌지', '포도'];
    res.render('fruits', { fruits: fruits });
})

app.listen(PORT, () => {
    console.log('서버 레디');
});