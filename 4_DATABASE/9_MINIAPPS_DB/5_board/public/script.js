document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 로딩 완료...');

    loadBoardCards();
})

function loadBoardCards() {
    fetch('/api/memo/table/board')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(item => {
            cardList = document.getElementById('card-list');
            
            const newCard = document.createElement('div');
            newCard.innerHTML = `
                    <div class="card-title">${item.title}</div>
                    <div class="card-message">${item.message}</div>`;
            newCard.className = 'card-item';
            newCard.dataset.id = item.id;

            cardList.appendChild(newCard);
        });
    });
    cardList.innerHTML = '';
}

function uploadPost() {
    console.log('버튼 클릭...');
    const title = document.getElementById('input-title');
    const message = document.getElementById('input-text');

    fetch('/api/memo/create', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.value, message: message.value })
    })
        .then(response => response.json())
        .then(() => {
            loadBoardCards();
            title.value = '';
            message.value = '';
        })
}

// document.getElementById('write-btn').addEventListener('click', () => {

// })

document.getElementById('left-side').addEventListener('click', (ev) => {
    console.log(ev);

    if (ev.target.className != 'card-title' && ev.target.className != 'card-message') {
        console.log('리스트를 선택하세요. ');
        return;
    }

    const cardId = ev.target.closest('.card-item').dataset.id;
    console.log(cardId);

    fetch(`/api/memo/${Number(cardId)}`)
        .then(response => response.json())
        .then(data => {
            const cardTitle = document.getElementById('input-title');
            const cardMessage = document.getElementById('input-text');
            cardTitle.value = data.title;
            cardTitle.readOnly = true;
            cardMessage.value = data.message;
            cardMessage.readOnly = true;
        })
})