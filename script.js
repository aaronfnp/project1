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

// Board Data Variables
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
let selected_Space_Data = {};
let isMoveValid = false;
let isJumpOver = false;

let winner = null;

/* --- CLASSES --- */

class base_piece {
  constructor(isKing, rowPos, colPos, player, color) {
    this.isKing = isKing;
    this.colPos = colPos;
    this.rowPos = rowPos;
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

  // SETTING INITIAL PIECE COUNTERS ON HTML + ARRAY
  for (i = 0; i < 8; i++) {
    if (i === 0 || i === 2 || i === 6) {
      for (j = 0; j < 8; j += 2) {
        var col = boardEl.querySelector('.col[col-data="' + j + '"]');
        col.children[i].innerHTML = `<h2>O</h2>`;

        // Color adjusted to placement & creates new pieces
        if (i === 0 || i === 2) {
          col.children[i].style.color = player1_Color;
          var piece = new base_piece(false, i, j, 1, player1_Color);
        }
        if (i === 6) {
          col.children[i].style.color = player2_Color;
          var piece = new base_piece(false, i, j, -1, player2_Color);
        }
        boardArray[i][j] = piece;
      }
    }
    if (i === 1 || i === 5 || i === 7) {
      for (j = 1; j < 8; j += 2) {
        var col = boardEl.querySelector('.col[col-data="' + j + '"]');
        col.children[i].innerHTML = `<h2>O</h2>`;

        // Color adjusted to placement
        if (i === 1) {
          col.children[i].style.color = player1_Color;
          var piece = new base_piece(false, i, j, 1, player1_Color);
        }
        if (i === 5 || i === 7) {
          col.children[i].style.color = player2_Color;
          var piece = new base_piece(false, i, j, -1, player2_Color);
        }
        boardArray[i][j] = piece;
      }
    }
  }
  console.log(boardArray);
}

function renderBoard() {
  colEls.forEach((col, colIndex) => {
    // Loop through each cell in the column to color board
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

    //If text element is clicked, swaps to the parent div
    if (clickedTarget.tagName === "H2") {
      console.log(clickedTarget);
      clickedTarget = clickedTarget.parentElement;
    }

    console.log(clickedTarget);

    loadData(clickedTarget);
    // Checks if selection valid
    if (
      !clickedTarget.classList.contains("cell") ||
      boardArray[colData][cellData] === null
    )
      return;
    // Selects Piece if 1st click
    if (clickSelector === 1) {
      console.log("first click");
      selected_Piece = clickedTarget;
      selected_Piece_Data = boardArray[cellData][colData];
      console.log(selected_Piece_Data);
      // Verifies that selection is a piece
      if (
        selected_Piece_Data instanceof base_piece &&
        selected_Piece_Data.player === playerTurn
      ) {
        selected_Piece.style.backgroundColor = "green";
        //Used to save original position
        current_Cell = cellData;
        current_Col = colData;
      } else {
        //Resets if blank space
        resetSelectData();
        return;
      }
    }

    // Both must be 2 away for jump over logic
    if (
      Math.abs(colData - current_Col) === 2 &&
      Math.abs(cellData - current_Cell) === 2
    ) {
      console.log("logic for 2 jump");
      isJumpOver = true;
      //Removing Jumped Over Piece Logic
      if (isJumpOver) {
        // let diffModifierCol = 2 / (colData - current_Col)
        // let diffModifierRow = 2 / (cellData - current_Cell)
        // if (boardarray[current_Cell + diffModRow][current_Col + diffModCol] instanceof Piece)
        // {
        //Boardarray[] = `${boardarray[].row}_${boardarray[].col}
        // }
        // else {
        //     return
        // }
      }
      // Must check if boardaray[] - 1 is instanceof piece
    }
    // Returns if larger gap than 1 && != 2
    if (!isJumpOver) {
      if (
        Math.abs(colData - current_Col) > 1 ||
        Math.abs(cellData - current_Cell) > 1
      ) {
        return;
      }
    }

    // Resets if clicked on same space
    if (clickSelector === -1 && selected_Piece === event.target) {
      resetSelectData();
    }

    // Selects Space to move if 2nd click
    if (clickSelector === -1 && selected_Piece_Data !== null) {
      console.log("second click");
      selected_Space = event.target;
      selected_Space_Data = boardArray[cellData][colData];
      // If selection is another piece, returns & highlights
      if (selected_Space_Data instanceof base_piece) {
        // POSSIBLE TO FLASH RED?
        selected_Space.style.backgroundColor = "blue";
        return;
      }

      // NOW NEED TO MAKE JUMP OVER MECHANIC
      if (boardArray[cellData - 1][colData - 1] instanceof base_piece) {
      }

      // Creates new piece using selected data
      boardArray[cellData][colData] = new base_piece(
        selected_Piece_Data.isKing,
        cellData,
        colData,
        selected_Piece_Data.player,
        selected_Piece_Data.color
      );

      // Changes visuals for HTML
      selected_Space.innerHTML = `<h2>O</h2>`;
      selected_Space.style.color = selected_Piece_Data.color;
      selected_Piece.innerHTML = `<h2></h2>`;
      boardArray[current_Cell][current_Col] = `${current_Cell}_${current_Col}`;

      resetSelectData();

      console.log(boardArray);
      //Changes player turn
      playerTurn *= -1;
    }
    // Changes to 2nd click
    clickSelector *= -1;
  }
}

// Resets all the variables for data
function resetSelectData() {
  selected_Piece.style.backgroundColor = "black";
  selected_Piece = null;
  selected_Space = null;
  selected_Piece_Data = null;
  current_Cell = null;
  current_Col = null;
  isMoveValid = false;
  isJumpOver = false;
}

function loadData(clickedTarget) {
  const col = clickedTarget.parentElement;
  colData = col.getAttribute("col-data");
  cellData = clickedTarget.getAttribute("cell-data");
  console.log(`Column: ${colData}`);
  console.log(`Row: ${cellData}`);
}

// isKingLogic
// use all 4 statements below
// use all logic
// isBaseLogic
// if player1
//      if (space col + 2 && row + 2)
//          if space col + 1 && row + 1 instanceof base_piece
//   if (space col - 2 && row + 2)
//          if space col - 1 && row + 1 instanceof base_piece
// if player2_Color
// // if (space col + 2 && row - 2)
//          if space col + 1 && row - 1 instanceof base_piece
// //   if (space col - 2 && row - 2)
//          if space col - 1 && row - 1 instanceof base_piece
// need logic to auto check if can go more,
// autoChecker();
