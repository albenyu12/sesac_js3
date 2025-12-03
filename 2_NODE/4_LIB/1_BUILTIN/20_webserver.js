const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    const ip = req.socket.remoteAddress;
    
    fs.readFile("index.html", "utf-8", (err, data) => {
        if (err) {
            console.log("에러");
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end("알 수 없는 오류가 발생했습니다. ");
            return;
        }
    })
    
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
});


server.listen(3000);