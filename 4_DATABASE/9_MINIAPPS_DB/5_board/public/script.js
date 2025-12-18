// 1. 이 파일 즉 이 페이지가 최초로 불릴때, 게시판에 글이 있을 수 있으니 로딩하기
document.addEventListener('DOMContentLoaded', () => {
    // fetch(게시판글)
    //      .then(카드만들기)
})

function makeCard(id, title, message) {
    // DOM 위치 가져오기
    // DOM 생성하기
    // 기존에 있던 DOM의 차일드 추가하기
}
 
function 글쓰기함수() {// 프런트에서 부른건 uploadPost()였음. 
    // DOM에서 입력한 글자를 가져오기ㅌ
    // fetch(글쓰기함수)
    //      .then(성공확인)
    //      .then(불러오기 (= 카드만들기))
    const title = document.getElementById('input-title').value;
    const message = document.getElementById('input-message').value;

    fetch('/api/create', {
        method: 'POST', 
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ title, message })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
}

function 삭제함수() {
    // fetch(글삭제함수)
    //      .then(성공확인)
    //      .then(불러오기 (= 카드만들기))
}

function 수정함수() {
    // DOM에서 입력한 글자를 가져오기
    // 기존에 글 있던 곳을 글 입력하는 곳의 DOM으로 바꾸기
    // 저장누르면
    // fetch(글수정함수)
    //      .then(성공확인)
    //      .then(불러오기 (= 카드만들기))
}