document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 로딩 완료');

    fetch('/api/todo')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            data.forEach(item => {
                document.getElementById('todoList').innerHTML += `
                    <li data-id=${item.id}>
                        <div class="todoContainer">
                        <input type="checkbox">
                        ${item}
                        </div>
                        <i class="deleteBtn ph-light ph-x"></i>
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
        body: JSON.stringify({ // 문자화 또는 직렬화(serialization)이라고 한다
            id: currentNum, 
            text: newTodo
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('todoList').innerHTML += `
                <li data-id=${data.id}>
                    <div class="todoContainer">
                    <input type="checkbox">
                    ${data.text}
                    </div>
                    <i class="deleteBtn ph-light ph-x"></i>
                </li>`;
            document.getElementById('newTodo').value = '';
        });

    currentNum++;
});

document.getElementById('todoList').addEventListener('click', (ev) => {
    if(!ev.target.classList.contains('deleteBtn')) {
        return;
    } 
    
    const line = ev.target.closest('li');
    const id = line.dataset.id;

    fetch(`/api/todo/${id}`, {
        method: 'DELETE', 
    })
        .then(response => response.json())
        .then(data => {
            line.remove();
        })
})