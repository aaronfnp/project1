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
let isForward = false;

let isWinner = false;
let pieceCounter_P1 = 0;
let pieceCounter_P2 = 0;

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
          pieceCounter_P1++;
        }
        if (i === 6) {
          col.children[i].style.color = player2_Color;
          var piece = new base_piece(false, i, j, -1, player2_Color);
          pieceCounter_P2++;
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
          pieceCounter_P1++;
        }
        if (i === 5 || i === 7) {
          col.children[i].style.color = player2_Color;
          var piece = new base_piece(false, i, j, -1, player2_Color);
          pieceCounter_P2++;
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
  if (!isWinner) {
    // Sets Clicked Target & Loads Data
    let clickedTarget = event.target;

    //If text element is clicked, swaps to the parent div
    if (clickedTarget.tagName === "H2") {
      console.log(clickedTarget);
      clickedTarget = clickedTarget.parentElement;
    }

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

    //Difference logic for 2 jump
    let diffCol = parseInt(colData) - parseInt(current_Col);
    let diffRow = parseInt(cellData) - parseInt(current_Cell);

    if (Math.abs(diffCol) === 2 && Math.abs(diffRow) === 2) {
      console.log("logic for 2 jump");
      isJumpOver = true;

      //Removing Jumped Over Piece Logic
      if (isJumpOver) {
        let diffModifierCol = 2 / diffCol;
        let diffModifierRow = 2 / diffRow;
        let midRow = parseInt(current_Cell) + diffModifierRow;
        let midCol = parseInt(current_Col) + diffModifierCol;
        let pieceToRemove = boardArray[midRow][midCol];

        if (
          pieceToRemove instanceof base_piece &&
          pieceToRemove.player != selected_Piece_Data.player
          // NEED TO ADD AND OTHER TEAM
        ) {
          forwardChecker(diffRow);
          if (!isForward) return;
          console.log(`Piece is: ${pieceToRemove.color}`);
          if (pieceToRemove.player === 1) pieceCounter_P1--;
          else if (pieceToRemove.player === -1) pieceCounter_P2--;
          console.log(`Piece Counter P1:${pieceCounter_P1}`);
          console.log(`Piece Counter P2:${pieceCounter_P2}`);
          boardArray[midRow][
            midCol
          ] = `${pieceToRemove.rowPos}_${pieceToRemove.colPos}`;
          // NEED TO ADD COUNTER PER TEAM

          var col = boardEl.querySelector('.col[col-data="' + midCol + '"]');
          col.children[midRow].innerHTML = `<h2></h2>`;
        } else {
          return;
        }
      }
      // Must check if boardaray[] - 1 is instanceof piece
    }
    // Returns if larger gap than 1 && != 2
    if (!isJumpOver) {
      if (Math.abs(diffCol) > 1 || Math.abs(diffRow) > 1) {
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

      // CURRENTLY WORKING ON
      forwardChecker(diffRow);
      if (!isForward) return;

      // If selection is another piece, returns & highlights
      if (selected_Space_Data instanceof base_piece) {
        // POSSIBLE TO FLASH RED?
        selected_Space.style.backgroundColor = "blue";
        return;
      }

      // LOGIC HERE FOR KING ME!
      if (cellData === "0" || cellData === "7") {
        selected_Piece_Data.isKing = true;
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
      if (selected_Piece_Data.isKing) {
        selected_Space.innerHTML = `<h2>K</h2>`;
      }
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

  // Declares winner depending on piece counter
  if (pieceCounter_P2 === 0) {
    declareWinner(1);
  } else if (pieceCounter_P1 === 0) {
    declareWinner(-1);
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
  pieceToRemove = null;
  isForward = false;
}

function loadData(clickedTarget) {
  const col = clickedTarget.parentElement;
  colData = col.getAttribute("col-data");
  cellData = clickedTarget.getAttribute("cell-data");
  console.log(`Column: ${colData}`);
  console.log(`Row: ${cellData}`);
}

function declareWinner(player) {
  isWinner = true;
  console.log(`Winner is: ${player}`);
}

function forwardChecker(diffRow) {
  // Checks team turn vs difference

  let numberToCheck = diffRow;

  console.log(diffRow);
  if (Math.abs(diffRow) === 2) {
    numberToCheck = diffRow / 2;
  }
  if (numberToCheck === playerTurn || selected_Piece_Data.isKing) {
    isForward = true;
    console.log(`is Forward`);
  } else {
    isForward = false;
    console.log(`is not Forward`);
  }
}
