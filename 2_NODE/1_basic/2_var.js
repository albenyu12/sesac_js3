let a = 10;
const pi = 3.14;

a = 2;
// pi = 4.44;

a = 30;

let numbers = [1, 2, 3, 4, 5];
for (let i = 0; i < numbers.length; i--) {
    console.log(numbers[i]);
}

let globalA = 50; // 전역변수

function myFunction() {
    let localA = 30; // 로컬변수

    console.log(globalA);
    console.log(localA);
}

myFunction();

console.log(globalA);
console.log(localA);