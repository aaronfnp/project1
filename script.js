/* --- VARIABLES --- */
const boardArray = [
  ["0_0", null, "0_2", null, "0_4", null, "0_6", null],
  [null, "1_1", null, "1_3", null, "1_5", null, "1_7"],
  ["2_0", null, "2_2", null, "2_4", null, "2_6", null],
  [null, "3_1", null, "3_3", null, "3_5", null, "3_7"],
  ["4_0", null, "4_2", null, "4_4", null, "4_6", null],
  [null, "5_1", null, "5_3", null, "5_5", null, "5_7"],
  ["6_0", null, "6_2", null, "6_4", null, "6_6", null],
  [null, "7_1", null, "7_3", null, "7_5", null, "7_7"],
];

const boardEl = document.querySelector("#board-wrapper");
const colEls = [...boardEl.children];

let colData = null;
let cellData = null;
let current_Col = null;
let current_Cell = null;

// Player Settings
const players = [1, 2];
let playerTurn = 1;
let player1_Color = "white";
let player2_Color = "red";

// Board Settings
// let boardLength = Changeable Length for board?

// Game Settings
let clickSelector = 1;
let selected_Piece = null;
let selected_Space = null;
let selected_Piece_Data = {};

let winner = null;

/* --- CLASSES --- */

class base_piece {
  constructor(isKing, position, player, color) {
    this.isKing = isKing;
    this.position = position;
    this.player = player;
    this.color = color;
  }
}

boardEl.addEventListener("click", runGame);
initializeGame();

/* --- FUNCTIONS --- */

function initializeGame() {
  //Create cells and col via script to make scalable?
  // Creates initial pieces - NEED TO REFACTOR

  renderBoard();

  // SETTING INITIAL PIECE COUNTERS ON HTML
  for (i = 0; i < 8; i++) {
    if (i === 0 || i === 2 || i === 6) {
      for (j = 0; j < 8; j += 2) {
        let piece = new base_piece(false, boardArray[i][j], 1, "white");
        boardArray[i][j] = piece;
        var col = boardEl.querySelector('.col[col-data="' + j + '"]');
        col.children[i].innerHTML = `<h2>O</h2>`;

        // Color adjusted to placement
        if (i === 0 || i === 2) {
          col.children[i].style.color = player1_Color;
        }
        if (i === 6) {
          col.children[i].style.color = player2_Color;
        }
      }
    }
    if (i === 1 || i === 5 || i === 7) {
      for (j = 1; j < 8; j += 2) {
        let piece = new base_piece(false, boardArray[i][j], 2, "red");
        boardArray[i][j] = piece;
        var col = boardEl.querySelector('.col[col-data="' + j + '"]');
        col.children[i].innerHTML = `<h2>O</h2>`;

        // Color adjusted to placement
        if (i === 1) {
          col.children[i].style.color = player1_Color;
        }
        if (i === 5 || i === 7) {
          col.children[i].style.color = player2_Color;
        }
      }
    }
    // if (i === 1 || i === 2 || i === 3) {
    //     col.children[i].style.color = "red";
    //   }
    //   if (i === 5 || i === 6 || i === 7) {
    //     col.children[i].style.color = "green";
    //   }
  }
  console.log(boardArray);
  // Change colors of all the cells
  // Add the pieces to the cells
  // Render the new pieces
}

function renderBoard() {
  colEls.forEach((col, colIndex) => {
    // Loop through each cell in the column
    [...col.children].forEach((cell, cellIndex) => {
      if ((colIndex + cellIndex) % 2 === 0) {
        cell.style.backgroundColor = "black";
      } else {
        cell.style.backgroundColor = "red";
      }
    });
  });
}

function runGame(event) {
  if (!winner) {
    // Sets Clicked Target & Loads Data
    let clickedTarget = event.target;
    loadData(clickedTarget);
    // Checks if selection valid
    if (
      !clickedTarget.classList.contains("cell") ||
      boardArray[colData][cellData] === null
    )
      return;
    // Selects Piece if 1st click
    if (clickSelector === 1 && clickedTarget) {
      console.log("first click");
      selected_Piece = event.target;
      selected_Piece_Data = boardArray[cellData][colData];
      selected_Piece.style.backgroundColor = "red";
    }
    // TODO - MUST CHECK IF SAME SELECTION AS CLICK 1
    // Selects Space to move if 2nd click
    if (clickSelector === -1) {
      console.log("second click");
      selected_Space = event.target;

      boardArray[cellData][colData] = new base_piece(
        selected_Piece_Data.isKing,
        `${cellData}_${colData}`,
        selected_Piece_Data.player,
        selected_Piece_Data.color
      );

      console.log(`Place piece at ${boardArray[cellData][colData]}`);
      loadData(selected_Piece);
      console.log(`Loading Data: ${selected_Piece}`);
      selected_Space.innerHTML = `<h2>O</h2>`;
      selected_Space.style.color = selected_Piece_Data.color;
      console.log(`Added at ${selected_Space}`);
      selected_Piece.innerHTML = `<h2></h2>`;
      console.log(`Removed at ${selected_Piece}`);

      resetSelectData();

      console.log(boardArray);
    }
    // Changes to 2nd click
    clickSelector *= -1;
  }
}

function resetSelectData() {
  selected_Piece.style.backgroundColor = "black";
  selected_Piece = null;
  selected_Space = null;
  selected_Piece_Data = null;
}

function loadData(clickedTarget) {
  const col = clickedTarget.parentElement;
  colData = col.getAttribute("col-data");
  cellData = clickedTarget.getAttribute("cell-data");
  console.log(`Column: ${colData}`);
  console.log(`Cell: ${cellData}`);
}
