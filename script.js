const board = document.getElementById('board');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('resetButton');
const modeToggleButton = document.getElementById('modeToggleButton');
const body = document.body;

let cells = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const CELL_SIZE = 80;
const GAP_SIZE = 12;
const BOARD_PADDING = 6;
const BOARD_DIMENSION = (CELL_SIZE * 3) + (GAP_SIZE * 2) + (BOARD_PADDING * 2);
const LINE_THICKNESS = 8;

function initializeGame() {
    board.innerHTML = '';
    cells.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell', 'rounded-lg');
        cellElement.dataset.index = index;
        cellElement.addEventListener('click', handleCellClick);
        board.appendChild(cellElement);
    });
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');
    modeToggleButton.textContent = 'Toggle Dark Mode';
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.index);

    if (cells[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    cells[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer === 'X' ? 'x-player' : 'o-player');

    checkResult();
}

function checkResult() {
    let roundWon = false;
    let winningLine = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = cells[winCondition[0]];
        let b = cells[winCondition[1]];
        let c = cells[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningLine = winCondition;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `Player ${currentPlayer} Wins!`;
        gameActive = false;

        winningLine.forEach(index => {
            const winningCellElement = board.children[index];
            winningCellElement.classList.add('winning-cell');
        });

        const strikeLine = document.createElement('div');
        strikeLine.classList.add('strike-line');

        const cellCenter = CELL_SIZE / 2 + BOARD_PADDING;

        if (winningLine[0] === 0 && winningLine[1] === 1 && winningLine[2] === 2) {
            strikeLine.style.width = `${BOARD_DIMENSION - (BOARD_PADDING * 2)}px`;
            strikeLine.style.top = `${cellCenter - (LINE_THICKNESS / 2)}px`;
            strikeLine.style.left = `${BOARD_PADDING}px`;
        } else if (winningLine[0] === 3 && winningLine[1] === 4 && winningLine[2] === 5) {
            strikeLine.style.width = `${BOARD_DIMENSION - (BOARD_PADDING * 2)}px`;
            strikeLine.style.top = `${(CELL_SIZE + GAP_SIZE) + cellCenter - (LINE_THICKNESS / 2)}px`;
            strikeLine.style.left = `${BOARD_PADDING}px`;
        } else if (winningLine[0] === 6 && winningLine[1] === 7 && winningLine[2] === 8) {
            strikeLine.style.width = `${BOARD_DIMENSION - (BOARD_PADDING * 2)}px`;
            strikeLine.style.top = `${2 * (CELL_SIZE + GAP_SIZE) + cellCenter - (LINE_THICKNESS / 2)}px`;
            strikeLine.style.left = `${BOARD_PADDING}px`;
        } else if (winningLine[0] === 0 && winningLine[1] === 3 && winningLine[2] === 6) {
            strikeLine.style.height = `${BOARD_DIMENSION - (BOARD_PADDING * 2)}px`;
            strikeLine.style.width = `${LINE_THICKNESS}px`;
            strikeLine.style.left = `${cellCenter - (LINE_THICKNESS / 2)}px`;
            strikeLine.style.top = `${BOARD_PADDING}px`;
        } else if (winningLine[0] === 1 && winningLine[1] === 4 && winningLine[2] === 7) {
            strikeLine.style.height = `${BOARD_DIMENSION - (BOARD_PADDING * 2)}px`;
            strikeLine.style.width = `${LINE_THICKNESS}px`;
            strikeLine.style.left = `${(CELL_SIZE + GAP_SIZE) + cellCenter - (LINE_THICKNESS / 2)}px`;
            strikeLine.style.top = `${BOARD_PADDING}px`;
        } else if (winningLine[0] === 2 && winningLine[1] === 5 && winningLine[2] === 8) {
            strikeLine.style.height = `${BOARD_DIMENSION - (BOARD_PADDING * 2)}px`;
            strikeLine.style.width = `${LINE_THICKNESS}px`;
            strikeLine.style.left = `${2 * (CELL_SIZE + GAP_SIZE) + cellCenter - (LINE_THICKNESS / 2)}px`;
            strikeLine.style.top = `${BOARD_PADDING}px`;
        } else if (winningLine[0] === 0 && winningLine[1] === 4 && winningLine[2] === 8) {
            const diagonalLength = Math.sqrt(Math.pow(BOARD_DIMENSION - (BOARD_PADDING * 2), 2) * 2);
            strikeLine.style.width = `${diagonalLength}px`;
            strikeLine.style.height = `${LINE_THICKNESS}px`;
            strikeLine.style.top = `${BOARD_DIMENSION / 2}px`;
            strikeLine.style.left = `${BOARD_DIMENSION / 2}px`;
            strikeLine.style.transform = 'translate(-50%, -50%) rotate(45deg)';
        } else if (winningLine[0] === 2 && winningLine[1] === 4 && winningLine[2] === 6) {
            const diagonalLength = Math.sqrt(Math.pow(BOARD_DIMENSION - (BOARD_PADDING * 2), 2) * 2);
            strikeLine.style.width = `${diagonalLength}px`;
            strikeLine.style.height = `${LINE_THICKNESS}px`;
            strikeLine.style.top = `${BOARD_DIMENSION / 2}px`;
            strikeLine.style.left = `${BOARD_DIMENSION / 2}px`;
            strikeLine.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
        }
        board.appendChild(strikeLine);

        return;
    }

    let roundDraw = !cells.includes('');
    if (roundDraw) {
        statusDisplay.textContent = `It's a Draw!`;
        gameActive = false;
        return;
    }

    switchPlayer();
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
}

function resetGame() {
    cells = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;

    Array.from(board.children).forEach(cellElement => {
        cellElement.classList.remove('winning-cell');
        cellElement.classList.remove('x-player');
        cellElement.classList.remove('o-player');
    });

    const existingStrikeLine = board.querySelector('.strike-line');
    if (existingStrikeLine) {
        board.removeChild(existingStrikeLine);
    }

    initializeGame();
}

function toggleMode() {
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        modeToggleButton.textContent = 'Toggle Light Mode';
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        modeToggleButton.textContent = 'Toggle Dark Mode';
    }
}

resetButton.addEventListener('click', resetGame);
modeToggleButton.addEventListener('click', toggleMode);

window.onload = initializeGame;
