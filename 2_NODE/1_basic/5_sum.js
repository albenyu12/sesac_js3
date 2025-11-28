function sumToNumber(num) {
    let sum = 0;
    for (let i = 1; i <= num; i++) {
        sum = sum + i;
    }
    console.log(`1부터 ${num}까지의 합은?: ${sum}`)
}

function sumToNumberGauss(num) {
    sum = (num * (num + 1)) / 2;
    console.log(`1부터 ${num}까지의 합은?: ${sum}`)
}

console.time("sum-to-100");
sumToNumber(100);
console.timeEnd("sum-to-100");

console.time("sum-to-100");
sumToNumberGauss(1_000_000)
// sumToNumber(1_000_000);
console.timeEnd("sum-to-100");

sumToNumber(10_000);
sumToNumber(10_000_000);