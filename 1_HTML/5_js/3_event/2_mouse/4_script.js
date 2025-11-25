function mouseClick() {
    console.log("클릭되었습니다");
}

const myButton = document.getElementById("myButton");
myButton.addEventListener("click", mouseClick);

// 1. DOM 가져온다
// 2. 원하는 이벤트를 등록한다
// 3. 그 이벤트가 발생했을 때 처리할 콜백함수를 등록한다
// 4. 그럼 입ㄴ트가 발생했을 때 그 함수로 이어져서 실행이 됨(비동기적으로)