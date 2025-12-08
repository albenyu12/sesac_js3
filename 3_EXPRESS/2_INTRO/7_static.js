const express = require('express');
const app = express();
const PORT = 3000;

// static 폴더 (정적 폴더 안에 있는 정적 파일, 여기에 img/css/js 같은 정적 파일들이 있으니 필요한 거 니가 알아서 가져가시오)

app.use(express.static('public'));

// 위치에 따라서 라우트에 오기 전에 index.html
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>document</title>
            </head>
            <body>
                <h1>본문 헤딩</h1>
                <img src="images/cat.jpeg" alt="고양이 사진">
            </body>
        </html>`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});