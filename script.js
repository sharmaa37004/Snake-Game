const gameBoard = document.getElementById('gameBoard');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restartButton');
const boardSize = 20;
const board = [];
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = {};
let score = 0;
let gameRunning = true;

function createBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const div = document.createElement('div');
            gameBoard.appendChild(div);
            board.push(div);
        }
    }
}

function drawSnake() {
    board.forEach(div => div.classList.remove('snake'));
    snake.forEach(segment => {
        const index = segment.y * boardSize + segment.x;
        board[index].classList.add('snake');
    });
}

function drawFood() {
    board.forEach(div => div.classList.remove('food'));
    const index = food.y * boardSize + food.x;
    board[index].classList.add('food');
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        placeFood();
    } else {
        snake.pop();
    }
}

function placeFood() {
    let newFoodPosition;
    do {
        newFoodPosition = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize),
        };
    } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));

    food = newFoodPosition;
}






function gameLoop() {
    if (!gameRunning) return;

    if (checkCollision()) {
        gameRunning = false;
        showGameOver();
        return;
    }

    function checkCollision() {
        const head = snake[0];
        if (
            head.x < 0 ||
            head.x >= boardSize ||
            head.y < 0 ||
            head.y >= boardSize ||
            (
                snake.slice(1).find(segment => segment.x === head.x && segment.y === head.y) !== undefined
            )
        ) {
            return true;
        }
        return false;
    }
    
    moveSnake();
    drawSnake();
    drawFood();
    setTimeout(gameLoop, 100);
}

function changeDirection(event) {
    const { key } = event;
    switch (key) {
        case 'ArrowUp':
            if (direction.y === 0) {
                direction = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
            if (direction.y === 0) {
                direction = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
            if (direction.x === 0) {
                direction = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (direction.x === 0) {
                direction = { x: 1, y: 0 };
            }
            break;
    }
}

function startGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    scoreElement.textContent = score;
    gameRunning = true;
    placeFood();
    drawSnake();
    drawFood();
    gameLoop();
}

function showGameOver() {
    const gameOverMessage = document.createElement('div');
    gameOverMessage.id = 'gameOverMessage';
    gameOverMessage.textContent = 'Game Over';
    document.body.appendChild(gameOverMessage);

    const restartHint = document.createElement('div');
    restartHint.id = 'restartHint';
    restartHint.textContent = 'Press "Restart" to play again';
    document.body.appendChild(restartHint);
}

function removeGameOverMessage() {
    const gameOverMessage = document.getElementById('gameOverMessage');
    const restartHint = document.getElementById('restartHint');
    if (gameOverMessage) gameOverMessage.remove();
    if (restartHint) restartHint.remove();
}

document.addEventListener('keydown', changeDirection);
restartButton.addEventListener('click', () => {
    removeGameOverMessage();
    startGame();
});

createBoard();
startGame();
