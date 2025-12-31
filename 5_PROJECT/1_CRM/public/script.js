document.addEventListener('DOMContentLoaded', () =>{
    getUserListPage();
})

let currentPageNum = 1;
const size = 10;

// 사용자 목록 조회
function getUserListPage() {
    const userList = document.getElementById('userList');
    const url = `/api/crm/users?page=${currentPageNum}&size=${size}`

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
document.querySelector('nav').addEventListener('click', (ev) => {
    const selectedPageNum = ev.target.textContent.trim();

    if (ev.target.className != "page-link") {
        return;
    } else {
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
})