let currentBoard = [];
const colorList = ['red', 'blue', 'green', 'yellow', 'orange', 'white', 'purple'];

function initialiseBoard(board, size) {
  for (let i = 0; i < size; i++) {
    let temp = [];
    for (let j = 0; j < size; j++) {
      temp.push(0);
    }
    board.push(temp);
  }
}

function createBoardDOM(board) {
  let boardDOM = document.querySelector(".board");
  boardDOM.innerHTML = "";
  let size = board.length;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let grid = document.createElement("div");
      grid.classList.toggle("grid");
      grid.dataset.row = i;
      grid.dataset.column = j;
      if (board[i][j] === 1){ grid.classList.toggle("alive");
      grid.style.backgroundColor = colorList[Math.floor(Math.random() * colorList.length)];
    }
      boardDOM.appendChild(grid);
    }
  }
}

function addEventHandlerGrid(handlerFunction) {
  document.querySelectorAll(".grid").forEach((grid) =>
    grid.addEventListener("mouseover", (e) => {
      if (e.buttons === 1) {
        handlerFunction(e);
      }
    })
  );
  document
    .querySelectorAll(".grid")
    .forEach((grid) => grid.addEventListener("mousedown", drawHandler));
}

function removeEventHandlerGrid(handlerFunction) {
  document
    .querySelectorAll(".grid")
    .forEach((grid) => grid.removeEventListener("mousedown", handlerFunction));
}

function drawHandler(e) {
  let row = +e.target.dataset.row;
  let column = +e.target.dataset.column;
  currentBoard[row][column] = currentBoard[row][column] === 0 ? 1 : 0;
  e.target.classList.toggle("alive");
}

function findNeighbours(board, coordinate) {
  let neighbours = 0;
  let i = coordinate[0];
  let j = coordinate[1];
  let size = board.length;
  if (i - 1 >= 0 && j - 1 >= 0 && board[i - 1][j - 1] === 1) neighbours++;
  if (i - 1 >= 0 && board[i - 1][j]) neighbours++;
  if (i - 1 >= 0 && j + 1 < size && board[i - 1][j + 1] === 1) neighbours++;
  if (j - 1 >= 0 && board[i][j - 1] === 1) neighbours++;
  if (j + 1 < size && board[i][j + 1] === 1) neighbours++;
  if (i + 1 < size && j - 1 >= 0 && board[i + 1][j - 1] === 1) neighbours++;
  if (i + 1 < size && board[i + 1][j]) neighbours++;
  if (i + 1 < size && j + 1 < size && board[i + 1][j + 1] === 1) neighbours++;
  return neighbours;
}

function tick() {
  let successorBoard = [];
  let size = currentBoard.length;
  for (let i = 0; i < size; i++) {
    let temp = [];
    for (let j = 0; j < size; j++) {
      let neighbours = findNeighbours(currentBoard, [i, j]);
      if (neighbours <= 1 && currentBoard[i][j] === 1) temp.push(0);
      else if (neighbours >= 4 && currentBoard[i][j] === 1) temp.push(0);
      else if (
        (neighbours === 2 || neighbours === 3) &&
        currentBoard[i][j] === 1
      )
        temp.push(1);
      else if (neighbours === 3 && currentBoard[i][j] === 0) temp.push(1);
      else temp.push(0);
    }
    successorBoard.push(temp);
  }
  createBoardDOM(successorBoard);
  currentBoard = successorBoard;
}

function startGame() {
  initialiseBoard(currentBoard, 32);
  console.log(currentBoard);
  createBoardDOM(currentBoard, 32);
  addEventHandlerGrid(drawHandler);
  document.querySelector("button").addEventListener("click", () => {
    const body = document.querySelector("body");
    const startBtn = document.querySelector("button");
    body.removeChild(startBtn);
    removeEventHandlerGrid(drawHandler);
    setInterval(tick, 300);
  });
}

startGame();

