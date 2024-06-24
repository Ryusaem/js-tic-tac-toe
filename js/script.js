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

  const addMark = (player) => (value = player);

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
  const board = gameBoard(); // Its a factory function... so we need to call it to get the object

  const players = [
    {
      name: PlayerOneName,
      mark: "X",
      score: 0,
    },
    {
      name: PlayerTwoName,
      mark: "O",
      score: 0,
    },
  ];

  let activePlayer = players[0]; // Player One starts first

  // Switch player function
  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  // Get active player
  const getActivePlayer = () => activePlayer;

  // Print new round
  const printNewRound = () => {
    board.printBoard(); // Print the board
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  // Function to ask for another game
  const askForAnotherGame = () => {
    const answer = prompt("Play another game? (yes/no):");
    if (answer.toLowerCase() === "yes") {
      console.log("Starting a new game...");
      board.resetBoard();
      printNewRound();
    } else {
      alert("Thank you for playing!");
      // Optionally, you can implement additional logic to properly end the game or navigate the user elsewhere
    }
  };

  // Update the score
  const updateScore = () => {
    activePlayer.score++; // Update the score;
    console.log(
      `Score updated: ${players[0].name}: ${players[0].score}, ${players[1].name}: ${players[1].score}`
    );
  };

  // Print scores
  const printScores = () => {
    console.log(
      `Score: ${players[0].name}: ${players[0].score}, ${players[1].name}: ${players[1].score}`
    );
  };

  // Play round
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
      board.printBoard(); // Print the board
      console.log(`${getActivePlayer().name} wins!`);
      updateScore();
      askForAnotherGame();
      return;
    }

    // Check if there is a draw
    if (board.checkDraw()) {
      board.printBoard();
      console.log("It's a draw!");
      return;
    }

    switchPlayer();
    printNewRound();
  };

  printNewRound(); // Print the new round
  printScores(); // Print the scores

  return {
    playRound,
    getActivePlayer,
    printScores,
  };
}

// Start the game
const game = GameController();

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
game.playRound(0, 2); // Player One
game.playRound(0, 0); // Player Two
game.playRound(1, 1); // Player One
game.playRound(1, 0); // Player Two
// game.playRound(2, 0); // Player One
