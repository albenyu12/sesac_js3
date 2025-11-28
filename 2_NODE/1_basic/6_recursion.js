// 재귀함수
function myFunction() {
    console.log("hello");
    myFunction();
    // 내가 나를 부르는 것 자체를 재귀함수(recursion)이라고 함
    // 무한루프에 빠지지 않도록 매우 주의해야함..
}

function factorial(n) {
    if (n == 1) return n;
    result = n * factorial(n-1);
    return result;
}

console.log(factorial(5));

function fibonacci(n) {
    if (n == 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

console.log(fibonacci(4));