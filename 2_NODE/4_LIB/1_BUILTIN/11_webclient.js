const http = require("http");

// const url = "http://www.example.com/path/test.html"
const url = "http://www.example.com/"

const req = http.request(url, (res) => {
    console.log("STATUS: ", res.statusCode);

    console.log("HEADERS: ", res.headers);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    res.on("data", (chunck) => {
        console.log(`Body: ${chunck}`);
    });
})

req.on("error", (error) => {
    console.log("오류발생");
});

req.end();