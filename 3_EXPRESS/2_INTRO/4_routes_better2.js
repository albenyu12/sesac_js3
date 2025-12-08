const express = require("express");
const app = express();
const PORT = 3000; // 보통 상수는 대문자로

app.get("/", (req, res) => {
    res.send("나의 루트");
})

// 상품조회는 일반적으로 GET파라미터, 쿼리 파라미터를 통해서 요청이 들어옴
// 예제) myshop/search?keyword=apple
// 실습) 127.0.0.1:3000/product?category=id&name=apple
app.get("/products", (req, res) => {
    // GET파라미터는 쿼리파라미터라고 부르고, req.query에 담겨서 옴
    console.log(`상품분류: ${req.query}, 상품이름: ${req.query.name}`);
    res.send("나의 상품");
})

app.get("/users/:id", (req, res) => {
    console.log(req.params.id);
    res.send(`내 사용자의 ID는 ${req.params.id}입니다.`);
})

app.post("/users", (req, res) => {
    let newId = 12341;
    res.send(`내 신규 사용자 생성: 신규 ID는 ${newId}입니다.`);
})

app.put("/users/:id", (req, res) => {
    res.send("나의 사용자 정보 수정");
})

app.delete("/users/:id", (req, res) => {
    res.send("나의 사용자 삭제");
})

app.listen(PORT, () => {
    console.log(`Server is ready at http://127.0.0.1:${PORT}/`);
})