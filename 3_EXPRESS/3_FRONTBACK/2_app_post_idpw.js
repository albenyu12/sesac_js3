const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/login', (req, res) => {
    let data = "";

    req.on('data', (chunk) => {
        data += chunk.toString();
    });

    req.on('end', () => {
        console.log(`온 데이터 모음: ${data}`);
        const params = new URLSearchParams(data);
        console.log(`온 데이터의 형변환: ${params}`);
        const obj = Object.fromEntries(params.entries());
        console.log(obj);
        res.send(`<h1>당신의 ID는 ${obj.id}이고 PW는 ${obj.pw}입니다</h1>`)
    })
});

app.listen(PORT, () => {
    console.log(`Server is ready at http://127.0.0.1:${PORT}`);
});