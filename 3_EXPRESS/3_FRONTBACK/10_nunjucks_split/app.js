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
    res.render('main', { title: '익스프레스 앱', content: 'NJK를 사용해서 렌더링' })
})

app.get('/user', (req, res) => {
    res.render('user', { title: '유저', content: '유저의 공간입니다' })
})

app.get('/product', (req, res) => {
    res.render('product', { title: '상품페이지', content: '각종 상품 정보' })
})

app.listen(PORT, () => {
    console.log('서버 레디');
});