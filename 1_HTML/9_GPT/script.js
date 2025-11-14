const desks = document.querySelectorAll(".desk");
const button = document.getElementById("shuffleButton");
const spinner = document.getElementById("spinner");

// 버튼 애니메이션
function animateButton() {
  button.classList.add("btn-click-animation");
  setTimeout(() => button.classList.remove("btn-click-animation"), 350);
}

// 자리 흔들림 + 페이드
function animateDesks() {
  desks.forEach(desk => {
    desk.classList.add("shuffle-effect");

    setTimeout(() => {
      desk.classList.remove("shuffle-effect");
      desk.classList.add("fade");
      setTimeout(() => desk.classList.remove("fade"), 400);
    }, 200);
  });
}

// 처음 로딩: 1~13
function fillSequential() {
  desks.forEach((desk, index) => {
    desk.textContent = index + 1;
  });
}

// 스피너 표시
function showSpinner() {
  spinner.classList.remove("hidden");
}

// 스피너 숨김
function hideSpinner() {
  spinner.classList.add("hidden");
}

// 셔플 기능
function shuffleNumbers() {
  animateButton();
  animateDesks();
  showSpinner();

  const numbers = Array.from({ length: 13 }, (_, i) => i + 1);

  // shuffle
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  // 숫자 변경은 약간 딜레이 후
  setTimeout(() => {
    desks.forEach((desk, index) => {
      desk.textContent = numbers[index];
    });
    hideSpinner();
  }, 600); // 스피너 유지시간
}

// 초기 배치
fillSequential();

// 버튼 클릭 이벤트
button.addEventListener("click", shuffleNumbers);
