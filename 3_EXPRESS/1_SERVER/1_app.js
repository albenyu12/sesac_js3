const http = require("http");

const server = http.createServer();

server.on("connection", () => {
    console.log("접속 시작");
})

server.on("request", (req, res) => {
    console.log("요청 시작");
    console.log("요청 메소드: ", req.method);
    console.log("요청 주소: ", req.url);
    // console.log("요청 헤더: ", req.headers);
    console.log("요청 헤더의 호스트: ", req.headers.host);
    console.log("요청 헤더의 UAgent: ", req.headers["user-agent"]);
    console.log("요청자의 주소: ", req.socket.remoteAddress);

    // 응답을 줄 차례...
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end("<h1>Hello, 마이서버</h1>");
})

server.listen(3000, () => {
    console.log("서버 레디");
})
