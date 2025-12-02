const path = require("path");

// 디렉토리 경로 == path
const filePath = path.join("hello", "world", "dir1/dir2", "sesac.txt");
console.log("파일경로: ", filePath);

// 파일의 확장자 가져오기
const extName = path.extname(filePath);
console.log("파일확장자: ", extName);

// 디렉토리 경로 가져오기
const dirName = path.dirname(filePath);
console.log("파일디렉토리명: ", dirName);