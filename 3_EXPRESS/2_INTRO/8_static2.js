const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;


app.get('/', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'public', 'index.html');

    // res.send();
    res.sendFile(htmlFilePath, (err) => {
        // 성공했으면 보내고 끝, 실패했으면 콜백함수를 통해서 처리
        if (err) {
            console.error("파일 전송 오류", err);
            res.status(500).send("서버에서 파일을 처리하는데 오류가 발생했습니다. ")
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});