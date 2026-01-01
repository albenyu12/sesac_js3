document.addEventListener('DOMContentLoaded', () =>{
    getUserListPage();
})

let userInput = '';
let currentPageNum = 1;
const size = 10;

// 사용자 목록 조회
function getUserListPage() {
    const url = `/api/crm/users?name=${userInput}&page=${currentPageNum}&size=${size}`
    const userList = document.getElementById('userList');

    userList.innerHTML = '';
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

// 페이지네이션
function pagination(selectedPageNum) {
    if (selectedPageNum == '»') {
        currentPageNum += 1;
        getUserListPage();
    } else if (selectedPageNum == '«') {
        currentPageNum -= 1;
        getUserListPage();
    } else {
        currentPageNum = parseInt(selectedPageNum);
        getUserListPage();
    }
}

document.getElementById('pagination').addEventListener('click', (ev) => {
    const selectedBtn = ev.target.textContent.trim();

    if (ev.target.className != "page-link") {
        return;
    } else {
        pagination(selectedBtn);
    }
})

document.getElementById('searchBtn').addEventListener('click', () => {
    currentPageNum = 1;
    userInput = document.getElementById('searchInput').value.trim();

    getUserListPage();
})