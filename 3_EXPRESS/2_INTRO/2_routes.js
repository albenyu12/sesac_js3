const express = require("express");
const app = express();
const PORT = 3000; // 보통 상수는 대문자로

app.get("/", (req, res) => {
    res.send("나의 루트");
})

app.get("/product", (req, res) => {
    res.send("나의 상품");
})

app.get("/user", (req, res) => {
    res.send("나의 사용자");
})

// 아래처럼 모든걸 GET으로 해서 CREATE, MODIFY 등등 URL명으로 하는 것은 가장 나쁜 원칙
app.get("/user/create", (req, res) => {
    res.send("나의 사용자 신규 생성");
})

app.get("/user/modify", (req, res) => {
    res.send("나의 사용자 정보 수정");
})

app.get("/user/delete", (req, res) => {
    res.send("나의 사용자 삭제");
})

app.listen(PORT, () => {
    console.log(`Server is ready at http://127.0.0.1:${PORT}/`);
})