const readline = require("readline-sync");

rl = readline;

console.log("여기1");

function gugudan(num) {
    console.log(` === ${num}단 === `);
    for (let i = 1; i <= 9; i++) {
        console.log(`${num} × ${i} = ${num * i}`)
    }
}

const input = rl.question("원하는 단을 입력하시오: ")
console.log("입력값: ", input);
gugudan(input);

console.log("여기2");