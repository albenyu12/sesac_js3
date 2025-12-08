// └── 파일명 찍기 / ├── 이어지는 곳 / │ 세로로 이어지는 곳
const fs = require("fs");
const path = require("path");

const basePath= "./";

fs.readdir(basePath, (err, files) => {
    if (err) {
        console.log("오류났음. 일단 끝");
        return;
    }

    console.log("성공결과: ", files);
    files.forEach(file => {
        const filePath = path.join(basePath, file);
        console.log("파일: ", filePath);
    });
})