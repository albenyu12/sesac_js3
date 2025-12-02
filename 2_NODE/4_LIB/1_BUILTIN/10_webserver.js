const fs = require("fs");
const http = require("http");
const server = http.createServer();

server.on("request", (req, res) => {
    console.log("http 요청이 시작되었습니다. ")

    fs.readFile("index2.html", "utf-8", (err, data) => {
        if (err) {
            console.log("파일 읽기 실패");
            res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
            res.end("<h1>사이트가 공사중입니다. </h1>");
        } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        }
    }) 
})

server.listen(8000);