document.addEventListener('DOMContentLoaded', () => {
    getUserListPage();
})

let userInput = '';
let currentPageNum = 1;
let size = 10;

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
function pagination(selectedPage) {
    const selectedPageNum = selectedPage.textContent.trim();
    const pageItems = document.querySelectorAll('.page-item');

    pageItems.forEach(item => {
        item.classList.remove('active');
    });

    if (selectedPageNum == '»') {
        currentPageNum ++;
    } else if (selectedPageNum == '«') {
        currentPageNum --;
    } else {
        currentPageNum = parseInt(selectedPageNum);
        selectedPage.classList.add('active');
    }

    if (currentPageNum > 1) {
        document.querySelector('.page-item').classList.remove('disabled');
    } else {
        document.querySelector('.page-item').classList.add('disabled');
    }

    pageItems.forEach(item => {
        if (item.textContent == currentPageNum) {
            item.classList.add('active');
        }
    })
}

document.getElementById('pagination').addEventListener('click', (ev) => {
    const selectedBtn = ev.target.closest('.page-item');

    if (!selectedBtn) {
        return;
    } else {
        pagination(selectedBtn);
        getUserListPage();
    }
})

// 사용자 이름 검색
document.getElementById('searchBtn').addEventListener('click', () => {
    currentPageNum = 1;
    userInput = document.getElementById('searchInput').value.trim();

    getUserListPage();
})