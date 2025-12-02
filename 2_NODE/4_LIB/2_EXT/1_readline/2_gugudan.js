const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout,
})

function gugudan(num) {
    console.log(` === ${num}단 === `);
    for (let i = 1; i <= 9; i++) {
        console.log(`${num} × ${i} = ${num * i}`)
    }
}

console.log("여기1");

rl.question("원하는 단을 입력하시오", (dan) => {
    gugudan(dan);
    rl.close();
})

console.log("여기2");