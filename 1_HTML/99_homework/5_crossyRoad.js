const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const finalScore = document.getElementById('finalScore');
const finalBest = document.getElementById('finalBest');
const instructions = document.getElementById('instructions');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartBtn = document.getElementById('restartBtn');

const gridSize = 40;
const rows = canvas.height / gridSize;
const cols = canvas.width / gridSize;

let player, world, vehicles, score, bestScore, gameStarted, gameOver;

function init() {
  player = { x: Math.floor(cols / 2), y: 0, color: 'yellow' };
  world = [];
  vehicles = [];
  score = 0;
  bestScore = parseInt(localStorage.getItem('bestCrossy')) || 0;
  bestEl.textContent = bestScore;
  gameStarted = false;
  gameOver = false;
  instructions.style.display = 'block';
  gameOverScreen.classList.add('hidden');
  generateWorld();
}

function generateWorld() {
  world = [];
  for (let i = 0; i < rows; i++) {
    const type = i < 3 ? 'grass' : Math.random() > 0.5 ? 'road' : 'grass';
    world.push({ type, vehicles: [] });
  }
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    instructions.style.display = 'none';
  }
}

function movePlayer(dx, dy) {
  if (gameOver) return;
  startGame();
  player.x = Math.max(0, Math.min(cols - 1, player.x + dx));
  player.y += dy;
  if (player.y < 0) {
    gameOver = true;
  }
  // Increase score when moving forward (up)
  if (dy > 0) {
    score++;
  }

  if (player.y >= world.length - 7) {
    scrollWorld();
  }
}

function scrollWorld() {
  const newRowType = Math.random() > 0.5 ? 'road' : 'grass';
  world.shift();
  world.push({ type: newRowType, vehicles: [] });
  player.y--;
}

function spawnVehicles() {
  world.forEach((row, index) => {
    if (row.type === 'road' && row.vehicles.length < 3 && Math.random() < 0.03) {
      const dir = Math.random() < 0.5 ? 1 : -1;
      const speed = Math.random() * 0.10 + 0.10;
      row.vehicles.push({
        x: dir === 1 ? 0 : cols - 1,
        dir,
        speed,
        color: 'red'
      });
    }
  });
}

function moveVehicles() {
  world.forEach(row => {
    if (row.type === 'road') {
      row.vehicles.forEach(v => v.x += v.speed * v.dir);
      row.vehicles = row.vehicles.filter(v => v.x >= -1 && v.x <= cols);
    }
  });
}

function checkCollision() {
  const currentRow = world[player.y];
  if (currentRow && currentRow.type === 'road') {
    for (let v of currentRow.vehicles) {
      if (Math.floor(v.x) === player.x) {
        gameOver = true;
        return;
      }
    }
  }
}

function update() {
  if (!gameStarted || gameOver) return;
  spawnVehicles();
  moveVehicles();
  checkCollision();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  world.forEach((row, i) => {
    const y = canvas.height - (i + 1) * gridSize;
    ctx.fillStyle = row.type === 'grass' ? 'green' : 'white';
    ctx.fillRect(0, y, canvas.width, gridSize);
    if (row.type === 'road') {
      row.vehicles.forEach(v => {
        ctx.fillStyle = v.color;
        ctx.fillRect(v.x * gridSize, y, gridSize, gridSize);
      });
    }
  });

  ctx.fillStyle = player.color;
  const py = canvas.height - (player.y + 1) * gridSize;
  ctx.beginPath();
  ctx.arc(player.x * gridSize + gridSize / 2, py + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
  ctx.fill();

  scoreEl.textContent = score;
}

function gameLoop() {
  update();
  draw();
  if (gameOver) showGameOver();
  requestAnimationFrame(gameLoop);
}

function showGameOver() {
  if (gameOverScreen.classList.contains('hidden')) {
    finalScore.textContent = score;
    bestScore = Math.max(bestScore, score);
    localStorage.setItem('bestCrossy', bestScore);
    bestEl.textContent = bestScore;
    finalBest.textContent = bestScore;
    gameOverScreen.classList.remove('hidden');
  }
}

restartBtn.addEventListener('click', () => {
  gameOverScreen.classList.add('hidden');
  init();
});

window.addEventListener('keydown', e => {
  const keys = {
    ArrowUp: [0, 1], ArrowDown: [0, -1],
    ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, 1], s: [0, -1], a: [-1, 0], d: [1, 0]
  };
  const move = keys[e.key];
  if (move) movePlayer(move[0], move[1]);
});

init();
gameLoop();
