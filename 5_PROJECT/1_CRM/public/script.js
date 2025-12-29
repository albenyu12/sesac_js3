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