const express = require("express");
const app = express();
const PORT = 3000; // 보통 상수는 대문자로

app.get("/", (req, res) => {
    res.send("나의 루트");
})

app.get("/products", (req, res) => {
    res.send("나의 상품");
})

app.get("/users", (req, res) => {
    res.send("나의 사용자");
})

app.post("/users", (req, res) => {
    res.send("나의 사용자 신규 생성");
})

app.put("/users", (req, res) => {
    res.send("나의 사용자 정보 수정");
})

app.delete("/users", (req, res) => {
    res.send("나의 사용자 삭제");
})

app.listen(PORT, () => {
    console.log(`Server is ready at http://127.0.0.1:${PORT}/`);
})