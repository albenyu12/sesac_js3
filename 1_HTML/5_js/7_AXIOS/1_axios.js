// 즉시 실행 함수 IIFE
// 1. 원래 fetch로 요청하기
// (async () => {
//     const res = await fetch('https://jsonplaceholder.typicode.com/posts/1')
//     const data = await res.json();
//     console.log(data);
// })();

async function fetchMain() {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1')
    const data = await res.json();
    console.log(data);
};

// 2. axios로 요청하기
async function axiosMain() {
    const axios = require('axios');
    const res = await axios.get('https://jsonplaceholder.typicode.com/posts/1')
    const data = await res.data;
    console.log(data);
}

axiosMain();