document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 로딩 완료...');

    loadBoardCards();
})

function loadBoardCards() {
    const cardList = document.getElementById('card-list');
    fetch('/api/note/table/board')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(item => {
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

    fetch('/api/note/create', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.value, message: message.value })
    })
        .then(response => response.json())
        .then(() => {
            loadBoardCards();
            title.value = '';
            message.value = '';
        });
}

function loadNewNote() {
    const cardTitle = document.getElementById('input-title');
    const cardMessage = document.getElementById('input-text');
    cardTitle.value = '';
    cardTitle.readOnly = false;
    cardMessage.value = '';
    cardMessage.readOnly = false;
}

document.getElementById('note-actions').addEventListener('click', (ev) => {
    const noteAction = ev.target.closest('button');
    console.log(noteAction.className.split(' '));

    if (noteAction.className.split(' ')[0] = 'note-action--create') {
        console.log('새 노트 가져오기 성공');
        loadNewNote();
    } else if(noteAction.className.split(' ')[0] = 'note-action--delete') {
        console.log('선택한 노트 삭제하기 완료');
        // fetch()
    } else {
        console.log('실패');

    }

});

document.getElementById('left-side').addEventListener('click', (ev) => {
    console.log(ev);

    if (ev.target.className != 'card-title' && ev.target.className != 'card-message') {
        console.log('리스트를 선택하세요. ');
        return;
    }

    const cardId = ev.target.closest('.card-item').dataset.id;
    console.log(cardId);

    fetch(`/api/note/${Number(cardId)}`)
        .then(response => response.json())
        .then(data => {
            const cardTitle = document.getElementById('input-title');
            const cardMessage = document.getElementById('input-text');
            cardTitle.value = data.title;
            cardTitle.readOnly = true;
            cardMessage.value = data.message;
            cardMessage.readOnly = true;
        });
})