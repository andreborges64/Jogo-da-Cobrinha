const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Pegando pontuação local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Recorde: ${highScore}`;

const updateFoodPosition = () => {
    let positionIsValid = false;

    while (!positionIsValid) {
        // Gera uma nova posição aleatória para a comida
        foodX = Math.floor(Math.random() * 30) + 1;
        foodY = Math.floor(Math.random() * 30) + 1;

        // Verifica se a nova posição não coincide com nenhuma parte do corpo da cobra
        positionIsValid = !snakeBody.some(segment => segment[0] === foodX && segment[1] === foodY);
    }
}

const handleGameOver = () => {
    // Limpando o timer e pontuação ao dar game over
    clearInterval(setIntervalId);
    endGame(score); // Mostra o card de fim de jogo
}

const endGame = (score) => {
    document.getElementById("score").innerText = score; // Atualiza a pontuação
    document.getElementById("gameOverCard").style.display = "block"; // Exibe o card
}

const closeCard = () => {
    document.getElementById("gameOverCard").style.display = "none"; // Esconde o card
    resetGame(); // Reinicia o jogo
}

const resetGame = () => {
    gameOver = false;
    snakeX = 5;
    snakeY = 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    scoreElement.innerText = `Pontos: ${score}`;
    highScoreElement.innerText = `Recorde: ${highScore}`;
    updateFoodPosition();
    clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, 150); // Reinicia o intervalo do jogo
}

const changeDirection = e => {
    // Alterando velocidade com base na tecla pressionada
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Chamando changeDirection a cada clique de tecla e passando o valor do dataset da tecla como um objeto
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Verificando se a cobra pegou a fruta
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Pegando a posição da comida para o array do corpo da cobra
        score++; // incrementa +1 para pontuação
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Pontos: ${score}`;
        highScoreElement.innerText = `Recorde: ${highScore}`;
    }
    // Atualizando a posição da cabeça da cobra com base na velocidade atual
    snakeX += velocityX;
    snakeY += velocityY;
    
    // Deslocando os valores dos elementos do corpo da cobra para frente em uma posição
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Setando o primeiro elemento do corpo da cobra para mover a posição dela

    // Checando se a cabeça da cobra está fora da parede para dar game over
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Adicionando uma div para cada parte do corpo da cobra
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Checando se a cabeça da cobra bateu no proprio corpo para dar game over
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 175); // velocidade da cobra, quanto maior o número, mais lenta ela será.
document.addEventListener("keyup", changeDirection);
