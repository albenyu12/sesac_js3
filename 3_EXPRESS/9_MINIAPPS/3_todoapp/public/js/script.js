document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 로딩 완료');

    fetch('/api/todo')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            data.forEach(item => {
                document.getElementById('todoList').innerHTML += `
                    <li>
                        <div class="todoContainer">
                        <input type="checkbox">
                        ${item}
                        </div>
                        <i class="deleteIcon ph-light ph-x"></i>
                    </li>`;
            });

            document.getElementById('newTodo').value = '';
        });
});

let currentNum = 0;

document.getElementById('addTodo').addEventListener('click', () => {
    const newTodo = document.getElementById('newTodo').value;

    fetch('/api/todo', {
        method: 'POST', 
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            id: currentNum, 
            text: newTodo
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('todoList').innerHTML += `
                <li>
                    <div class="todoContainer">
                    <input type="checkbox">
                    ${data}
                    </div>
                    <i class="deleteIcon ph-light ph-x"></i>
                </li>`;
            document.getElementById('newTodo').value = '';
        });

    currentNum++;
});