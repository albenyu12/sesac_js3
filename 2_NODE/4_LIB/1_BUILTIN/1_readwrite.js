// 파일 입출력
const fs = require("fs");

fs.readFile("example.txt", "utf-8", (err, data) => {
    console.log("일단끝 - 결과가 성공/실패건 일단 끝났음");
    if (err) {
        console.log("파일 읽기에 실패했습니다. ", err)
    } else {
        console.log(data);
    }
});

console.log("내가 더 먼저 끝남");

// 파일 쓰기
const content = "여기에는 내가 쓰고 싶은 내용을 작성합니다. ";
fs.writeFile("example2.txt", content, "utf-8", (err) => {
    if (err) {
        console.log("파일쓰기에 실패했습니다. ");
    } else {
        console.log("파일쓰기에 성공했습니다. ");
    }
})

console.log("난 언제 호출될까?");