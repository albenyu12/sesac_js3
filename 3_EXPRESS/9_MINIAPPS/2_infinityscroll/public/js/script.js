// document.addEventListener('DOMContentLoaded', () =//     // console.log('DOM ready');
//     fetch('/api/items')
//         .then(response => response.json())
//         .then (data => {
    //             console.log(data);
    //             // const result = document.getElementById('resultLog');
    //             // result.innerHTML = JSON.stringify(data);
    //             // result.innerHTML = data;
    //         })
    // });
    
    // 4. async/await로 변경 하기
document.getElementById('loadBtn').addEventListener('click', () => {
    const startNum = document.getElementById('startNum').value
    const endNum = document.getElementById('endNum').value
    fetch(`/api/items`, {
        method: 'POST', 
        headers: { 'Content-type': 'application/json'},
        body: JSON.stringify({
            start: startNum,
            end: endNum
        })
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const result = document.getElementById('result');
            result.innerHTML += `<p>${item}</p>`;
        });

    })
})