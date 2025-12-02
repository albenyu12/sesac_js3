const url = require("url");

const myURL = "http://www.example.com/path/test.html"

const urlObject = new URL(myURL);

console.log("호스트: ", urlObject.host);
console.log("경로: ", urlObject.pathname);
console.log("쿼리: ", urlObject.search);