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
  const printBoard = (activePlayer) => {
    const boardDiv = document.querySelector(".board");

    board.forEach((row, indexRow) => {
      row.forEach((cell, indexColumn) => {
        // Anything clickable should be a button!!
        const cellButton = document.createElement("button");

        // Add a class to the cell
        cellButton.classList.add("board__cell");

        // Create a data attribute to identify the state of the cell
        cellButton.dataset.fieldState = `set-${cell.getValue()}`;

        // Create a data attribute to identify the player's turn
        cellButton.dataset.fieldTurn = `turn-${activePlayer}`;

        // Create a data attribute to identify the column and row
        cellButton.dataset.column = indexColumn;
        cellButton.dataset.row = indexRow;

        boardDiv.appendChild(cellButton);
      });
    });
  };

  // Print the board in the console
  const _printBoardConsole = () => {
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
  const boardCells = document.querySelectorAll(".board__cell");
  const boards = document.querySelector(".board");

  const playAgainButton = document.querySelector(
    ".game-end-container__again-btn"
  );
  const stopPlayingButton = document.querySelector(
    ".game-end-container__stop-btn"
  );

  const gameEndContainer = document.querySelector(".game-end-container");

  const winnerDiv = document.querySelector(".game-end-container__winner-icon");
  const gameMessage = document.querySelector(
    ".game-end-container__game-message"
  );

  const player1Turn = document.querySelector(".score-container__player1-turn");
  const player2Turn = document.querySelector(".score-container__player2-turn");
  const resetBtn = document.querySelector(".score-container__reset-btn");

  const player1Score = document.querySelector(".score-container__player1-btn");
  const player2Score = document.querySelector(".score-container__player2-btn");
  const tieScore = document.querySelector(".score-container__tie-btn");

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

  // Active player variable
  let activePlayer;
  let winner;
  let tiedMatches = 0;

  // not workinkg
  // const activateClickedClassBtn = (element) => {
  //   function removeClickedClass(event) {
  //     console.log("Transition ...");
  //     if (event.propertyName !== "transform") return;
  //     event.target.classList.remove("clicked");
  //     console.log("Transition ended");
  //   }

  //   console.log("Transition started");
  //   element.classList.add("clicked");

  //   element.addEventListener("click", removeClickedClass);
  //   element.addEventListener("transitionend", (event) => {
  //     console.log("transitionend event fired for:", element);
  //     removeClickedClass(event);
  //   });
  // };

  // SET active player to player one
  const setActivePlayer = () => (activePlayer = players[0]);

  // GET active player
  const getActivePlayer = () => activePlayer;

  // SET winner
  const setWinner = (player) => (winner = player);

  // GET winner
  const getWinner = () => winner;

  // SWITCH player function
  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  // Add active class to the player's turn
  const addActiveClassToPlayerTurn = () => {
    if (activePlayer.mark === "X") {
      player1Turn.classList.add("active");
      player2Turn.classList.remove("active");
    } else {
      player2Turn.classList.add("active");
      player1Turn.classList.remove("active");
    }
  };

  // Reset Game (After a win or a draw)
  const resetGame = () => {
    board.resetBoard(); // Reset the board

    setActivePlayer(); // Player One starts first
    addActiveClassToPlayerTurn(); // Add active class to the player's turn

    printNewRound(); // Print the new round

    game.updateScreen(); // Update the screen

    hideContainerAndButtons();
  };

  // Stop playing (After a win or a draw)
  const stopPlaying = () => {
    console.log("Game ended.");

    board.resetBoard(); // Reset the board

    setActivePlayer(); // Player One starts first
    addActiveClassToPlayerTurn(); // Add active class to the player's turn

    players[0].score = 0; // Reset the score of player one
    players[1].score = 0; // Reset the score of player two
    tiedMatches = 0; // Reset the tied matches

    game.updateScreen(); // Update the screen

    hideContainerAndButtons();
  };

  // After the game ends, ask for another game
  const askForAnotherGame = () => {
    // console.log("Game ended. Click 'Play Again' to start a new game.");

    showContainerAndButtons();
  };

  // Hide the container and buttons
  const hideContainerAndButtons = () => {
    // gameEndContainer.style.display = "none"; // Hide the game end container
    gameEndContainer.classList.remove("active");

    // containerButton.style.display = "none"; // Hide the container after starting a new game

    // btnsButton.forEach((button) => {
    //   button.style.display = "none"; // Hide the button after starting a new game
    // });
  };

  // Show the container and buttons
  const showContainerAndButtons = () => {
    // gameEndContainer.style.display = "grid";

    gameEndContainer.classList.add("active");

    // Display the container button
    // containerButton.style.display = "grid";

    // btnsButton.forEach((button) => {
    //   button.style.display = "block"; // Show the button after starting a new game
    // });
  };

  const showGameMessage = (message, tie = false) => {
    // const messageParagraph = document.getElementById("game-message");
    const congratulation = document.querySelector(
      ".game-end-container__congratulation"
    );

    if (!tie) {
      congratulation.textContent = "CONGRATULATIONS !";
    }

    gameMessage.textContent = message; // Set the message text
  };

  // PRINT Board and Player's turn
  const printNewRound = () => {
    board.printBoard(getActivePlayer().mark); // Print the board
  };

  // PRINT scores
  const printScores = () => {
    function updatePlayerScore(playerScoreElement, player) {
      const playerName = document.createElement("p");
      playerName.className = "score-container__player-score-name";
      playerName.textContent = player.name;

      const playerScoreValue = document.createElement("p");
      playerScoreValue.className = "score-container__player-score-value";
      playerScoreValue.textContent = player.score;

      playerScoreElement.innerHTML = ""; // Clear existing content
      playerScoreElement.appendChild(playerName);
      playerScoreElement.appendChild(playerScoreValue);
    }

    updatePlayerScore(player1Score, players[0]);
    updatePlayerScore(player2Score, players[1]);
    updatePlayerScore(tieScore, { name: "Ties", score: tiedMatches });
  };

  // UPDATE the score locally
  const updateScore = () => {
    activePlayer.score++; // Update the score;

    // console.log(
    //   `Score updated: ${players[0].name}: ${players[0].score}, ${players[1].name}: ${players[1].score}`
    // );
  };

  // UPDATE the winner display
  const updateWinnerDisplay = () => {
    let imageUrl;
    let messageColor;

    switch (getWinner()) {
      case players[0].name:
        imageUrl = getComputedStyle(document.documentElement)
          .getPropertyValue("--field-state-set-X")
          .trim();
        messageColor = "var(--color-base-blue)";
        break;

      case players[1].name:
        imageUrl = getComputedStyle(document.documentElement)
          .getPropertyValue("--field-state-set-O")
          .trim();
        messageColor = "var(--color-base-orange)";
        break;

      case "draw":
        imageUrl = getComputedStyle(document.documentElement)
          .getPropertyValue("--draw-icon")
          .trim();
        messageColor = "var(--color-base-yellow)";
        break;

      default:
        console.log("Invalid winner");
        return; // Exit the function if the winner is not recognized
    }

    // Apply the determined styles
    winnerDiv.style.backgroundImage = `${imageUrl}`;

    // Changing the background color of the play again button
    playAgainButton.style.backgroundColor = messageColor;

    // Changing the color of the game message
    gameMessage.style.color = messageColor;
  };

  // PLAY round
  const playRound = (row, column) => {
    // console.log(
    //   `Marking ${
    //     getActivePlayer().name
    //   }'s mark into row ${row} & column ${column}...`
    // );

    // Verify if the player move is successful
    const success = board.playerMove(row, column, getActivePlayer().mark);

    // If the player move is not successful, print an error message
    if (!success) {
      console.log("Action failed. Try again.");
      return;
    }

    // Check if there is a winner
    if (board.checkWin(getActivePlayer().mark)) {
      setWinner(getActivePlayer().name); // Set the winner

      updateWinnerDisplay(); // Update the winner display

      updateScore(); // Increment the score of the winner

      askForAnotherGame();

      showGameMessage(`${winner} is the winner!`); // Show the message

      return;
    }

    // Check if there is a draw
    if (board.checkDraw()) {
      setWinner("draw"); // Set the winner to draw
      tiedMatches++; // Increment the tied matches

      updateWinnerDisplay(); // Update the winner display

      askForAnotherGame();

      showGameMessage("It's a draw!", true); // Show the message

      return;
    }

    switchPlayer(); // Switch player
    addActiveClassToPlayerTurn(); // Add active class to the player's turn
    printNewRound(); // Print the new round
  };

  // Play again button
  playAgainButton.addEventListener("click", resetGame);

  stopPlayingButton.addEventListener("click", stopPlaying); // Stop playing button

  resetBtn.addEventListener("click", resetGame); // Reset button

  // Calling few functions
  setActivePlayer();
  addActiveClassToPlayerTurn();
  printNewRound(); // Print the new round
  printScores(); // Print the scores

  return {
    playRound,
    getActivePlayer,
    printBoard: board.printBoard,
    printScores,
    getBoard: board.getBoard,
  };
}

function ScreenController() {
  // Selectors
  const boardDiv = document.querySelector(".board");

  const game = GameController(); // Start the game

  // Update the screen
  const updateScreen = () => {
    // Get the active player
    const activePlayer = game.getActivePlayer();

    // Clear the board
    boardDiv.textContent = "";

    // Get newest board and player Turn
    game.getBoard();

    // Print the board
    game.printBoard(activePlayer.mark);

    // Update the scores
    game.printScores();
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
const game = ScreenController();
