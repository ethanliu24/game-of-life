let continueSimulation = false;
let isErasing = false;

const states = new Map();
states.set("black", 0);
states.set("white", 1);
states.set(0, "black");
states.set(1, "white");

const boardDOM = document.querySelector("#board");

const slider = document.querySelector("#grid-size-range");
const sliderValue = document.querySelector("#slider-value");
slider.addEventListener("click", () => {
    sliderValue.textContent = slider.value;
    initBoard();
});

const clearBtn = document.querySelector("#clear-btn");
clearBtn.addEventListener("click", () => {
    let rows = boardDOM.children;
    for (let i = 0; i < rows.length; i++) {
        let squares = rows[i].children
        for (let j = 0; j < squares.length; j++) {
            squares[j].style.backgroundColor = "black";
        }
    }
});

clearBtn.addEventListener("mouseenter", (e) => {
    if (!e.target.disabled) {
        e.target.style.backgroundColor = "white";
        e.target.style.color = "black";
    } 
});

clearBtn.addEventListener("mouseleave", (e) => {
    if (!e.target.disabled) {
        e.target.style.backgroundColor = "black";
        e.target.style.color = "white";
    }
});

const nextGenBtn = document.querySelector("#next-gen-btn");
nextGenBtn.addEventListener("click", () => {
    board = readBoard();
    oneGeneration();
});

nextGenBtn.addEventListener("mouseenter", (e) => {
    if (!e.target.disabled) {
        e.target.style.backgroundColor = "white";
        e.target.style.color = "black";
    } 
});

nextGenBtn.addEventListener("mouseleave", (e) => {
    if (!e.target.disabled) {
        e.target.style.backgroundColor = "black";
        e.target.style.color = "white";
    }
});

let readCurrentBoard = true;
const startBtn = document.querySelector("#start-btn");
startBtn.addEventListener("click", () => {
    clearBtn.disabled = true;
    clearBtn.style.color = "gray";
    nextGenBtn.disabled = true;
    nextGenBtn.style.color = "gray";

    if (readCurrentBoard) {
        board = readBoard();
        readCurrentBoard = false;
    }

    continueSimulation = true;
    startSimulation();
});

const stopBtn = document.querySelector("#stop-btn");
stopBtn.addEventListener("click", () => {
    continueSimulation = false;
    readCurrentBoard = true;
    clearBtn.disabled = false;
    clearBtn.style.color = "white";
    nextGenBtn.disabled = false;
    nextGenBtn.style.color = "white";
});

addEventListener("DOMContentLoaded", initBoard());


function initBoard() {
    boardDOM.textContent = "";
    let gridSize = slider.value;

    for (let i = 0; i < gridSize; i++) {
        let row = document.createElement("div");
        row.classList.add("row");

        for (let j = 0; j < gridSize; j++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.style.backgroundColor = "black"
            square.addEventListener("click", (e) => {
                if (e.target.style.backgroundColor === "white") {
                    e.target.style.backgroundColor = "black";
                } else {
                    e.target.style.backgroundColor = "white";
                }
            });

            row.appendChild(square);
        }

        boardDOM.appendChild(row);
    }
}


function startSimulation() {
    if (continueSimulation) {
        // board = readBoard();
        oneGeneration();
        setTimeout(startSimulation, 100);
    }
}


function oneGeneration() {
    let copy = copyBoard(board);
    let rows = boardDOM.children;

    for (let i = 0; i < board.length; i++) {
        let squares = rows[i].children;
        for (let j = 0; j < board.length; j++) {
            board[i][j] = calcState(copy, i, j);
            squares[j].style.backgroundColor = states.get(board[i][j]);
        }
    }
}


function calcState(board, i, j) {
    // 1. Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
    // 2. Any live cell with two or three live neighbours lives on to the next generation.
    // 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
    // 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    let numNeighbours = countNeighbours(board, i, j);

    // dead cell
    if (board[i][j] === 0) {
        return numNeighbours === 3 ? 1 : 0
    }

    // living cell
    if (numNeighbours <= 1) {
        return 0
    } else if (numNeighbours <= 3) {
        return 1
    } else {
        return 0
    }
}


function countNeighbours(board, i, j) {
    let movements = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]
    let neighbours = 0

    for (let k = 0; k < movements.length; k++) {
        x = movements[k][0]
        y = movements[k][1]

        if (i + x < 0 || i + x >= board.length || j + y < 0 || j + y >= board.length) {
            continue;
        } else {
            if (board[i + x][j + y] === 1) { neighbours ++; }
        }
    }

    return neighbours
}


function readBoard() {
    let res = [];
    let rows = boardDOM.children;
    for (let i = 0; i < rows.length; i++) {
        let squares = rows[i].children;
        let r = [];
        for (let j = 0; j < squares.length; j++) {
            r.push(states.get(squares[j].style.backgroundColor));
        }

        res.push(r);
    }

    return res;
}


function copyBoard(board) {
    let copy = [];
    for (let i = 0; i < board.length; i++) {
        let row = [];
        for (let j = 0; j < board.length; j++) {
            row.push(board[i][j]);
        }
        copy.push(row);
    }
    return copy;
}


