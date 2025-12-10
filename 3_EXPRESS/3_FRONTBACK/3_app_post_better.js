const express = require('express');
const app = express();
const PORT = 3000;

// form 데이터로부터 온 것을 x-www-form-urlencoded 라고 부름
// 이 미들웨어는 사용자로부터 전달받은 위 MIME 타입을 찾아서 req.body에 담아준다
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));

app.post('/login', (req, res) => {
    console.log(req.body);
    const id = req.body.id;
    const pw = req.body.pw;

    res.send(`당신의 ID는 ${id}, 비밀번호는 ${pw}입니다`);
});

app.listen(PORT, () => {
    console.log(`서버 레디`);
});