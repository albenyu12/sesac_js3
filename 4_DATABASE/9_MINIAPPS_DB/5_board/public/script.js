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
            cardList = document.getElementById('cardList');
            
            const newCard = document.createElement('div');
            newCard.innerHTML = `
                    <div class="cardTitle">${item.title}</div>
                    <div class="cardMessage">${item.message}</div>`;
            newCard.className = 'cardItem';
            newCard.dataset.id = item.id;

            cardList.appendChild(newCard);
        });
    });
    cardList.innerHTML = '';
}

function uploadPost() {
    console.log('버튼 클릭...');
    const title = document.getElementById('inputTitle');
    const message = document.getElementById('inputText');

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

document.getElementById('leftSide').addEventListener('click', (ev) => {
    console.log(ev);

    if (ev.target.className != 'cardTitle' && ev.target.className != 'cardMessage') {
        console.log('리스트를 선택하세요. ');
        return;
    }

    const cardId = ev.target.closest('.cardItem').dataset.id;
    console.log(cardId);

    fetch(`/api/memo/${Number(cardId)}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('mainContent').innerHTML = `
            <h3>${data.title}</h3>
            <div>${data.message}</div>
            `;
        })
})