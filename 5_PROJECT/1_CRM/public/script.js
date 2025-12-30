document.addEventListener('DOMContentLoaded', () =>{
    getUserList();
})

// 사용자 목록 조회
function getUserList() {
    const userList = document.getElementById('userList');
    fetch('/api/crm/users')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                <td>${item.Id}</td>
                <td>${item.Name}</td>
                <td>${item.Gender}</td>
                <td>${item.Age}</td>
                <td>${item.Birthdate}</td>
                `;
                userList.appendChild(newRow);
            });
        })
}

let page = 1;
const size = 10;

function getUserListPage() {
    const userList = document.getElementById('userList');
    const url = `/api/crm/users?page=${page}&size=${size}`

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                <td>${item.Id}</td>
                <td>${item.Name}</td>
                <td>${item.Gender}</td>
                <td>${item.Age}</td>
                <td>${item.Birthdate}</td>
                `;
                userList.appendChild(newRow);
            });
        })
}

let pageNum = 1;

document.querySelector('nav').addEventListener('click', (ev) => {
    // console.log(ev.target);

    if (ev.target.textContent.trim() == '»') {
        pageNum += 1;
        console.log(pageNum);
    } else if (ev.target.textContent.trim() == '«') {
        pageNum -= 1;
        console.log(pageNum);
    } else {
        pageNum = parseInt(ev.target.textContent.trim());
        console.log(pageNum);
    }
})