const fs = require("fs");
const path = require("path");

const basePath= "../../../";

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