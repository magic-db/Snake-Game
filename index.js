const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const highScoreText = document.querySelector("#highScoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const obstaclesColor = "black";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
];
let obstacles = [];
let powerUpX;
let powerUpY;
let powerUpActive = false;
let speed =    275;  

highScoreText.textContent = `Highscore: ${highScore}`;

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
    running = true;
    score = 0;
    scoreText.textContent = `Score: ${score}`;
    highScoreText.textContent = `Highscore: ${highScore}`;
    obstacles = []; 
    createFood();
    createObstacles(); 
    drawFood();
    drawObstacles();
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            drawObstacles();
            moveSnake();
            drawSnake();
            createPowerUp();
            drawPowerUp();
            checkPowerUp();
            checkGameOver();
            nextTick();
        }, speed);  // Verwende die `speed`-Variable für die Geschwindigkeit
    } else {
        displayGameOver();
    }
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    function randomCoordinate(min, max) {
        return Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    }
    foodX = randomCoordinate(0, gameWidth - unitSize);
    foodY = randomCoordinate(0, gameHeight - unitSize);
}

function createObstacles() {
    if (running){
        for (let i = 0; i < 5; i++) {
            const obstacle = {
                x: Math.round((Math.random() * (gameWidth - unitSize)) / unitSize) * unitSize,
                y: Math.round((Math.random() * (gameHeight - unitSize)) / unitSize) * unitSize
            };
            obstacles.push(obstacle);
        }
    }
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function drawObstacles() {
    ctx.fillStyle = obstaclesColor;
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, unitSize, unitSize);
    });
}

function createPowerUp() {
    if (!powerUpActive) {
        powerUpX = Math.round((Math.random() * (gameWidth - unitSize)) / unitSize) * unitSize;
        powerUpY = Math.round((Math.random() * (gameHeight - unitSize)) / unitSize) * unitSize;
        powerUpActive = true;
    }
}

function drawPowerUp() {
    if (powerUpActive) {
        ctx.fillStyle = "blue";
        ctx.fillRect(powerUpX, powerUpY, unitSize, unitSize);
    }
}

function checkPowerUp() {
    if (snake[0].x === powerUpX && snake[0].y === powerUpY) {
        powerUpActive = false;
        createPowerUp();
        speed = 150;  
        setTimeout(() => {
            speed = 75;  
        }, 7000);
    }
}

function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    snake.unshift(head);

    if (snake[0].x === foodX && snake[0].y === foodY) {
        score++;
        scoreText.textContent = `Score: ${score}`;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreText.textContent = `Highscore: ${highScore}`;
        }
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((snakePart, index) => {
        ctx.fillStyle = snakeColor;
        ctx.strokeStyle = snakeBorder;
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
        
        // Zeichne Augen und Zunge nur für den Kopf
        if (index === 0) {
            
            const eyeRadius = unitSize / 6;  // Kleinere Augen
            const eyeOffsetX = unitSize / 5;
            const eyeOffsetY = unitSize / 5;

            ctx.fillStyle = "black";
            
            if (xVelocity > 0) {
                ctx.beginPath();
                ctx.arc(snakePart.x + eyeOffsetX, snakePart.y + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
                ctx.arc(snakePart.x + unitSize - eyeOffsetX, snakePart.y + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
                ctx.fill();
            } else if (xVelocity < 0) {
                ctx.beginPath();
                ctx.arc(snakePart.x + unitSize - eyeOffsetX, snakePart.y + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
                ctx.arc(snakePart.x + eyeOffsetX, snakePart.y + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
                ctx.fill();
            } else if (yVelocity > 0) {
                ctx.beginPath();
                ctx.arc(snakePart.x + eyeOffsetX, snakePart.y + unitSize - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
                ctx.arc(snakePart.x + unitSize - eyeOffsetX, snakePart.y + unitSize - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
                ctx.fill();
            } else if (yVelocity < 0) {
                ctx.beginPath();
                ctx.arc(snakePart.x + eyeOffsetX, snakePart.y + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
                ctx.arc(snakePart.x + unitSize - eyeOffsetX, snakePart.y + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = "pink";
            ctx.beginPath();
            if (xVelocity > 0) {
                ctx.moveTo(snakePart.x + unitSize / 2, snakePart.y + unitSize); 
                ctx.lineTo(snakePart.x + unitSize / 2 - 5, snakePart.y + unitSize + 10); 
                ctx.lineTo(snakePart.x + unitSize / 2 + 5, snakePart.y + unitSize + 10); 
            } else if (xVelocity < 0) {
                ctx.moveTo(snakePart.x + unitSize / 2, snakePart.y + unitSize); 
                ctx.lineTo(snakePart.x + unitSize / 2 - 5, snakePart.y + unitSize - 10); 
                ctx.lineTo(snakePart.x + unitSize / 2 + 5, snakePart.y + unitSize - 10); 
            } else if (yVelocity > 0) {
                ctx.moveTo(snakePart.x + unitSize / 2, snakePart.y + unitSize); 
                ctx.lineTo(snakePart.x + unitSize / 2 - 5, snakePart.y + unitSize + 10); 
                ctx.lineTo(snakePart.x + unitSize / 2 + 5, snakePart.y + unitSize + 10); 
            } else if (yVelocity < 0) {
                ctx.moveTo(snakePart.x + unitSize / 2, snakePart.y + unitSize); 
                ctx.lineTo(snakePart.x + unitSize / 2 - 5, snakePart.y + unitSize - 10); 
                ctx.lineTo(snakePart.x + unitSize / 2 + 5, snakePart.y + unitSize - 10); 
            }
            ctx.closePath();
            ctx.fill();
        }
    });
}


function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity === -unitSize);
    const goingDown = (yVelocity === unitSize);
    const goingRight = (xVelocity === unitSize);
    const goingLeft = (xVelocity === -unitSize);

    switch (true) {
        case (keyPressed === LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case (keyPressed === RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
}

function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0):
        case (snake[0].x >= gameWidth):
        case (snake[0].y < 0):
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            running = false;
        }
    }
    obstacles.forEach(obstacle => {
        if (snake[0].x === obstacle.x && snake[0].y === obstacle.y) {
            running = false;
        }
    });
}

function displayGameOver() {
    obstacles = []; 
    ctx.font = "80px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", gameWidth / 2, gameHeight / 2);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, gameWidth, gameHeight);
    ctx.fillStyle = "black";
    ctx.fillText("GAME OVER", gameWidth / 2, gameHeight / 2);

    running = false;
}

function resetGame() {
    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ];
    xVelocity = unitSize;
    yVelocity = 0;
    speed = 75;  
    gameStart();
}
