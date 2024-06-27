// Game Board Module
function gameBoard() {
  const rows = 3;
  const cols = 3;
  const board = [];

  // Initialize the board
  const initializeBoard = (rows, cols) => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < cols; j++) {
        board[i].push(createCell()); // Create a cell object for each column
      }
    }
    return board;
  };

  // Get the board
  const getBoard = () => board;

  // Print the board
  const printBoard = () => {
    const boardWithCellValues = board
      .map((row) => row.map((cell) => cell.getValue()).join(" | "))
      .join("\n---------\n");

    console.log(boardWithCellValues);
  };

  // Check if there is a winner
  const checkWin = (player) => {
    // Check rows
    for (let i = 0; i < rows; i++) {
      if (board[i].every((cell) => cell.getValue() === player)) return true; // Check rows
    }

    // Check columns
    for (let j = 0; j < cols; j++) {
      if (board.every((row) => row[j].getValue() === player)) return true; // Check columns
    }

    // Check first diagonal
    let winDiagonal1 = true;
    for (let i = 0; i < rows; i++) {
      if (board[i][i].getValue() !== player) {
        winDiagonal1 = false;
        break;
      }
    }
    if (winDiagonal1) return true;

    // Check second diagonal
    let winDiagonal2 = true;
    for (let i = 0; i < rows; i++) {
      if (board[i][rows - 1 - i].getValue() !== player) {
        winDiagonal2 = false;
        break;
      }
    }
    if (winDiagonal2) return true;

    return false; // No winner
  };

  // Check if there is a draw
  const checkDraw = () => {
    return board.flat().every((cell) => cell.getValue() !== "");
  };

  // Player move
  const playerMove = (row, column, player) => {
    const cell = board[row][column];

    if (cell.getValue() === "") {
      cell.addMark(player);
      return true;
    }
    return false;
  };

  // Reset the board
  const resetBoard = () => {
    return initializeBoard(rows, cols);
  };

  initializeBoard(rows, cols); // Initialize the board

  return {
    printBoard, // Print the board
    playerMove, // Player move
    getBoard, // Get the board
    checkDraw, // Check if there is a draw
    checkWin, // Check if there is a winner
    resetBoard, // Reset the board
  };
}

// Create a cell
function createCell() {
  let value = ""; // Cell value can be "X", "O", or ""

  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addMark,
    getValue,
  };
}

// Game controller
function GameController(
  PlayerOneName = "Player One",
  PlayerTwoName = "Player Two"
) {
  // Selectors
  const playAgainButton = document.querySelector(".again");
  const stopPlayingButton = document.querySelector(".stop");
  const btnsButton = document.querySelectorAll(".btn");
  const containerButton = document.querySelector(".button-container");

  const player1Score = document.querySelector(".player1-score");
  const player2Score = document.querySelector(".player2-score");

  // Start the game board
  const board = gameBoard();

  // Players
  const players = [
    {
      name: PlayerOneName,
      mark: `X`,
      score: 0,
    },
    {
      name: PlayerTwoName,
      mark: "O",
      score: 0,
    },
  ];

  // Active player
  let activePlayer;

  // SET active player to player one
  const setActivePlayer = () => (activePlayer = players[0]);

  // GET active player
  const getActivePlayer = () => activePlayer;

  setActivePlayer();

  // SWITCH player function
  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  // Reset Game (After a win or a draw)
  const resetGame = () => {
    console.log("Starting a new game...");

    board.resetBoard(); // Reset the board

    setActivePlayer(); // Player One starts first

    printNewRound(); // Print the new round

    game.updateScreen(); // Update the screen

    hideContainerAndButtons();
  };

  // Stop playing (After a win or a draw)
  const stopPlaying = () => {
    console.log("Game ended.");

    board.resetBoard(); // Reset the board

    setActivePlayer(); // Player One starts first

    players[0].score = 0; // Reset the score of player one

    game.updateScreen(); // Update the screen

    hideContainerAndButtons();
  };

  // After the game ends, ask for another game
  const askForAnotherGame = () => {
    console.log("Game ended. Click 'Play Again' to start a new game.");

    showContainerAndButtons();
  };

  // Hide the container and buttons
  const hideContainerAndButtons = () => {
    containerButton.style.display = "none"; // Hide the container after starting a new game

    btnsButton.forEach((button) => {
      button.style.display = "none"; // Hide the button after starting a new game
    });
  };

  // Show the container and buttons
  const showContainerAndButtons = () => {
    // Display the container button
    containerButton.style.display = "flex";

    btnsButton.forEach((button) => {
      button.style.display = "block"; // Show the button after starting a new game
    });
  };

  // PRINT Board and Player's turn
  const printNewRound = () => {
    board.printBoard(); // Print the board
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  // PRINT scores
  const printScores = () => {
    // console.log(
    //   `Score: ${players[0].name}: ${players[0].score}, ${players[1].name}: ${players[1].score}`
    // );
    player1Score.textContent = `${players[0].name}: ${players[0].score}`;
    player2Score.textContent = `${players[1].name}: ${players[1].score}`;
  };

  // UPDATE the score
  const updateScore = () => {
    activePlayer.score++; // Update the score;

    console.log(
      `Score updated: ${players[0].name}: ${players[0].score}, ${players[1].name}: ${players[1].score}`
    );
  };

  // PLAY round
  const playRound = (row, column) => {
    console.log(
      `Marking ${
        getActivePlayer().name
      }'s mark into row ${row} & column ${column}...`
    );

    // Verify if the player move is successful
    const success = board.playerMove(row, column, getActivePlayer().mark);

    // If the player move is not successful, print an error message
    if (!success) {
      console.log("Action failed. Try again.");
      return;
    }

    // Check if there is a winner
    if (board.checkWin(getActivePlayer().mark)) {
      console.log(`${getActivePlayer().name} wins!`);

      updateScore(); // Increment the score of the winner

      askForAnotherGame();

      return;
    }

    // Check if there is a draw
    if (board.checkDraw()) {
      console.log("It's a draw!");

      askForAnotherGame();

      return;
    }

    switchPlayer();
    printNewRound();
  };

  printNewRound(); // Print the new round
  printScores(); // Print the scores

  // Event Listener
  playAgainButton.addEventListener("click", resetGame); // Play again button
  stopPlayingButton.addEventListener("click", stopPlaying); // Stop playing button

  return {
    playRound,
    getActivePlayer,
    printScores,
    getBoard: board.getBoard,
  };
}

function ScreenController() {
  // Selectors
  const playerTurnDiv = document.querySelector(".turn");
  const player1Turn = document.querySelector(".player1-turn");
  const player2Turn = document.querySelector(".player2-turn");
  const boardDiv = document.querySelector(".board");

  const game = GameController(); // Start the game

  // Update the screen
  const updateScreen = () => {
    // Clear the board
    boardDiv.textContent = "";

    // Get newest board and player Turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    // playerTurnDiv.textContent = `${activePlayer.name}'s turn`;

    // Add active class to the player's turn

    if (activePlayer.mark === "X") {
      player1Turn.classList.add("active");
      player2Turn.classList.remove("active");
    } else {
      player2Turn.classList.add("active");
      player1Turn.classList.remove("active");
    }

    // Render board squares
    board.forEach((row, indexRow) => {
      row.forEach((cell, indexColumn) => {
        // Anything clickable should be a button!!
        const cellButton = document.createElement("button");

        // Add a class to the cell
        cellButton.classList.add("cell");

        // Create a data attribute to identify the state of the cell
        cellButton.dataset.fieldState = `set-${cell.getValue()}`;

        // Create a data attribute to identify the player's turn
        cellButton.dataset.fieldTurn = `turn-${activePlayer.mark}`;

        // Create a data attribute to identify the column and row
        cellButton.dataset.column = indexColumn;
        cellButton.dataset.row = indexRow;

        // Add the value of the cell
        // cellButton.textContent = cell.getValue();

        // Append the cell to the board
        boardDiv.appendChild(cellButton);
      });
    });

    // Update the scores
    game.printScores(); // Print the scores
  };

  // Event Handler for the board
  const clickHandlerBoard = (event) => {
    const selectColumn = event.target.dataset.column;
    const selectRow = event.target.dataset.row;

    if (!selectColumn) return;

    // Play the round with the selected row and column
    game.playRound(selectRow, selectColumn);

    // Update the screen
    updateScreen();
  };

  // Event Listener for every cell
  boardDiv.addEventListener("click", clickHandlerBoard);

  // Initial render
  updateScreen();

  return {
    updateScreen,
  };
}

// Start the game
// const game = GameController();
const game = ScreenController();

// Test cases

// Check Rows (it works)
// game.playRound(0, 0); // Player One
// game.playRound(1, 0); // Player Two
// game.playRound(0, 1); // Player One
// game.playRound(1, 1); // Player Two
// // game.playRound(0, 2); // Player One

// Check Columns (it works)
// game.playRound(0, 0); // Player One
// game.playRound(0, 1); // Player Two
// game.playRound(1, 0); // Player One
// game.playRound(1, 1); // Player Two
// game.playRound(2, 0); // Player One

// Check Diagonals (first) (it works)
// game.playRound(0, 0); // Player One
// game.playRound(0, 1); // Player Two
// game.playRound(1, 1); // Player One
// game.playRound(1, 0); // Player Two
// game.playRound(2, 2); // Player One

// Check Diagonals (second) (it works)
// game.playRound(0, 2); // Player One
// game.playRound(0, 0); // Player Two
// game.playRound(1, 1); // Player One
// game.playRound(1, 0); // Player Two
// game.playRound(2, 0); // Player One
