const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("<h1>hello, express</h1>");
});

app.listen(3000, () => {
    console.log("익스프레스 서버가 준비되었습니다. ");
})