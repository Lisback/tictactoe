const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const start2PlayersButton = document.getElementById('start-2players');
const startAIButton = document.getElementById('start-ai');
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');
const clickSound = document.getElementById('click-sound');
const winSound = document.getElementById('win-sound');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isAgainstAI = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer);

    clickSound.play(); // Jouer le son du clic

    checkForWinner();

    if (isAgainstAI && gameActive) {
        currentPlayer = 'O';
        setTimeout(aiMove, 500); // L'ordinateur joue après un délai
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function aiMove() {
    if (!gameActive) return;

    // Choisir une case aléatoire vide
    let availableCells = gameState.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    if (availableCells.length > 0) {
        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        gameState[randomCell] = currentPlayer;
        cells[randomCell].textContent = currentPlayer;
        cells[randomCell].classList.add(currentPlayer);

        clickSound.play(); // Jouer le son du clic

        checkForWinner();
        currentPlayer = 'X'; // Revenir au joueur humain
    }
}

function checkForWinner() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
            continue;
        }
        if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        winSound.play(); // Jouer le son de la victoire
        alert(`Le joueur ${currentPlayer} a gagné !`);
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        alert('Match nul !');
        gameActive = false;
        return;
    }
}

function restartGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });
}

start2PlayersButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    isAgainstAI = false;
    restartGame();
});

startAIButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    isAgainstAI = true;
    restartGame();
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);