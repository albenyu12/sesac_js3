const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;


app.get('/', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'public', 'index.html');

    res.sendFile(htmlFilePath, (err) => {
        if (err) {
            nextTick(new Error("파일을 찾을 수 없습니다. "))
        }
    });
});

// 에러 처리 공통 핸들러를 등록하는 미들웨어
app.use((err, req, res, next) => {
    console.error('에러 발생: ', err.message);
    res.status(500).json({ message: '서버 내부 오류가 발생했습니다. 관리자에게 문의해주세요. '})
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});