import { GENERATE_RANDOM_ID } from "./helpers.js";

/* GLOBAL VArIABLES
=================== */
let currnetRoute = "/";
const ALL_ROUTES = [
  "/",
  "/match-details",
  "/match/playground",
  "/match/round-result",
];
let CURRENT_PLAYER = 1;

const HITS_ARRAY = new Array(9).fill(0);
let HITS_NUM = 0;

/* DOM Elements
=============== */
// Getting the App area
const app = document.getElementById("app");

/* Events Functions
========================= */
// Handle the mouse down effect on the button
const handleMouseDownOnButton = (e, shadowColor) => {
  e.target.style.transform = "translateY(0px)";
  e.target.style.boxShadow = "0px 0px 0px " + shadowColor;
};

// Handle the mouse up effect on the button
const handleMouseUpOnButton = (e, shadowColor) => {
  e.target.style.transform = "translateY(-8px)";
  e.target.style.boxShadow = "0px 8px 0px " + shadowColor;
};

// Creat a function that gets called by click event and navigates to the match details page
const moveToRouteHandler = (route) => {
  currnetRoute =
    typeof route == "string" &&
    route.trim().length > 0 &&
    ALL_ROUTES.indexOf(route) > -1
      ? route
      : "/";
  // Calling the function that is responsable for changing the views
  handlingCurrentView();
};

// Match Details Form Submit Handlere
const submitMatchDetailsForm = (e) => {
  e.preventDefault();

  const matchDetails = {
    id: GENERATE_RANDOM_ID(36),
    matchDate: Date.now(),
    playerOneName: e.target[0].value,
    playerTwoName: e.target[1].value,
    score: {
      playerOne: 0,
      playerTwo: 0,
      ties: 0,
    },
  };

  const matchesData = JSON.parse(localStorage.getItem("matches-data")) || [];

  if (!matchDetails) {
    localStorage.setItem("matches-data", JSON.stringify([matchDetails]));
  } else {
    matchesData.push(matchDetails);
    localStorage.setItem("matches-data", JSON.stringify(matchesData));
  }

  moveToRouteHandler("/match/playground");
};

// Get specicfic match details based on the id
const getMatchData = (matchId) => {
  const matchDetails = JSON.parse(localStorage.getItem("matches-data"));

  const matchData = matchDetails.filter((match) => match.id === matchId)[0];

  return matchData;
};

// Reset game board
const resetBoardHandler = () => {
  HITS_ARRAY.fill(0);
  HITS_NUM = 0;

  const allPlayedSquares = document.querySelectorAll(
    ".playground-page  .playgournd-wrapper .playgournd-square:not(.available)"
  );

  allPlayedSquares.forEach((square) => {
    square.innerHTML = "";
    square.classList.add("available");
    setCurrentPlayer(1);
    CURRENT_PLAYER = 1;
    square.setAttribute("data-shape", "");
  });
};

// Detect current player
const setCurrentPlayer = (playerNumber) => {
  // Set the current payer turn on the UI
  const currentPLayerTurnImg = document.querySelector(
    ".playground-page .controls-wrapper .current-turn img"
  );

  currentPLayerTurnImg.src = `./assets/${playerNumber === 1 ? "x" : "o"}.png`;
};

// Fill the square with the current player shape
const hitSquare = (e) => {
  const playedShape = document.createElement("img");

  if (e.target.classList.contains("available")) {
    HITS_NUM++;
    // Give it a noice border effect
    e.target.style.border = `2px solid ${
      CURRENT_PLAYER == 1 ? "#31C4C0" : "#F2B137"
    }`;
    // Play the shape at the squre
    playedShape.src = `./assets/${CURRENT_PLAYER == 1 ? "x" : "o"}.png`;
    e.target.appendChild(playedShape);
    // Add data attribute to the square
    e.target.setAttribute("data-shape", CURRENT_PLAYER == 1 ? "x" : "o");

    const squareIndex = parseInt(e.target.id.charAt(e.target.id.length - 1));

    CURRENT_PLAYER = CURRENT_PLAYER == 1 ? 2 : 1;
    setCurrentPlayer(CURRENT_PLAYER);
    e.target.classList.remove("available");

    detectWinOrTie(squareIndex);
  }
};

// Detect if there is a winner
const detectWinOrTie = (playedIndex) => {
  HITS_ARRAY.splice(playedIndex, 1, CURRENT_PLAYER == 1 ? "x" : "o");
  // Hits array be like ['x', 'x', 'o', 'x', 'o', 'x', 'o', 'o', 'x']

  const rowCheckResult = checkRows();
  const columnCheckResult = checkColumns();

  if (rowCheckResult.win) {
    console.log("GAME DONE!");
    console.log("THE WINNER IS: PLAYER " + rowCheckResult.winner);
    const winnerPlayer = {
      playerNumber: rowCheckResult.winner,
      playerName: getPlayerName(rowCheckResult.winner),
    };
    app.appendChild(genRoundResultTemplate(winnerPlayer));
    resetBoardHandler();
  } else if (columnCheckResult.win) {
    console.log("GAME DONE!");
    console.log("THE WINNER IS: PLAYER " + columnCheckResult.winner);
    const winnerPlayer = {
      playerNumber: columnCheckResult.winner,
      playerName: getPlayerName(columnCheckResult.winner),
    };
    app.appendChild(genRoundResultTemplate(winnerPlayer));
    resetBoardHandler();
  } else if (HITS_ARRAY.every((sq) => ["x", "o"].indexOf(sq) > -1)) {
    console.log("ROUND DONE WITH A TIE!");
    app.appendChild(genRoundResultTemplate(null));
    resetBoardHandler();
  }
};

// Get player name in a current match
const getPlayerName = (playerNumber) => {
  playerNumber =
    typeof playerNumber == "number" && [1, 2].indexOf(playerNumber) > -1
      ? playerNumber
      : false;

  if (playerNumber) {
    const allMatches = JSON.parse(localStorage.getItem("matches-data"));
    const currentMatch = allMatches[allMatches.length - 1];

    const playerName =
      currentMatch[playerNumber == 1 ? "playerOneName" : "playerTwoName"];

    return playerName;
  }
};

// Check of a row is a win
const checkRows = () => {
  // We have 3 rows
  // Wo we need to check 3 times

  for (let i = 0; i < 3; i++) {
    const row = HITS_ARRAY.slice(i * 3, i * 3 + 3);
    if (row.every((el) => el == row[0] && ["x", "o"].indexOf(el) > -1)) {
      return { win: true, winner: row[0] == "x" ? 2 : 1 };
    }
  }
  return { win: false, winner: null };
};

// Check of a column is a win
const checkColumns = () => {
  // We have 3 columns
  // The different between 2 following elements is 3 in index

  for (let i = 0; i < 3; i++) {
    const column = [HITS_ARRAY[i], HITS_ARRAY[i + 3], HITS_ARRAY[i + 6]];
    if (column.every((el) => el == column[0] && ["x", "o"].indexOf(el) > -1)) {
      return { win: true, winner: column[0] == "x" ? 2 : 1 };
    }
  }

  return { win: false, winner: null };
};

// Continue the match and update the score
const continueTheMatchAndUpdateScore = (winnerNumber) => {
  console.log("JUMP!");
  const allMatches = JSON.parse(localStorage.getItem("matches-data"));
  const currentMatch = allMatches[allMatches.length - 1];

  const updatedMatch = {
    ...currentMatch,
    score: {
      playerOne:
        winnerNumber == 1
          ? currentMatch.score.playerOne + 1
          : currentMatch.score.playerOne,
      playerTwo:
        winnerNumber == 2
          ? currentMatch.score.playerTwo + 1
          : currentMatch.score.playerTwo,
      ties:
        winnerNumber == 0
          ? currentMatch.score.ties + 1
          : currentMatch.score.ties,
    },
  };

  allMatches.pop();
  allMatches.push(updatedMatch);

  localStorage.setItem("matches-data", JSON.stringify(allMatches));
};

/* Generating all app templates
=============================== */
// Generating Home page temlpate
const genHomeTemplate = () => {
  /* Creating DOM Elements
  ======================== */
  const homeRoot = document.createElement("center");
  homeRoot.classList.add("home-page");

  const homePageHeader = document.createElement("header");

  const logo = document.createElement("img");
  logo.src = "./assets/logo.png";
  logo.width = "70";

  // Appending the logo to the header
  homePageHeader.appendChild(logo);

  // Creating the h1 tag for the hero section
  const headerH1 = document.createElement("h1");

  // Creating and adding the first span attributes and appending it to the created h1 tag
  const H1FirstSpan = document.createElement("span");
  H1FirstSpan.className = "color-yellow";
  H1FirstSpan.textContent = "Tic";
  headerH1.appendChild(H1FirstSpan);

  // Creating and adding the second span attributes and appending it to the created h1 tag
  const H1SecondSpan = document.createElement("span");
  H1SecondSpan.className = "color-green";
  H1SecondSpan.textContent = " Tac";
  headerH1.appendChild(H1SecondSpan);
  // Creating and adding the third span attributes and appending it to the created h1 tag
  const H1ThirdSpan = document.createElement("span");
  H1ThirdSpan.className = "color-yellow";
  H1ThirdSpan.textContent = " Toe!";
  headerH1.appendChild(H1ThirdSpan);

  // Creating the h1 water mark
  const watermark = document.createElement("img");
  watermark.src = "./assets/xo-watermark.png";
  watermark.width = "70";
  watermark.classList.add("xo", "watermark");
  headerH1.appendChild(watermark);

  // Create the paragraph
  const homeParagraph = document.createElement("p");
  homeParagraph.textContent = "The best game ever.";

  // Creating the button
  const startGameButton = document.createElement("button");
  startGameButton.id = "start-game";
  startGameButton.textContent = "Start the game!";

  startGameButton.addEventListener("click", () =>
    moveToRouteHandler("/match-details")
  );
  startGameButton.addEventListener("mousedown", (e) =>
    handleMouseDownOnButton(e, "#906C29")
  );
  startGameButton.addEventListener("mouseup", (e) =>
    handleMouseUpOnButton(e, "#906C29")
  );

  // Appending all elements to the parent element
  homeRoot.appendChild(homePageHeader);
  homeRoot.appendChild(headerH1);
  homeRoot.appendChild(homeParagraph);
  homeRoot.appendChild(startGameButton);

  return homeRoot;
};

// Generating Start-Game page temlpate
const genMatchDetailsTemplate = () => {
  /* Creating DOM Elements
  ======================== */
  const matchDetailsRoot = document.createElement("center");
  matchDetailsRoot.classList.add("match-details-page");

  const matchDetialsPageHeader = document.createElement("header");

  const logo = document.createElement("img");
  logo.src = "./assets/logo.png";
  logo.width = "70";

  // Appending the logo to the header
  matchDetialsPageHeader.appendChild(logo);

  // Create the back to home button
  const backToHomeButton = document.createElement("button");
  backToHomeButton.textContent = "Back to home";

  // Creating the form that takes in all the match details
  const matchDetailsForm = document.createElement("form");
  matchDetailsForm.id = "match-details-form";

  matchDetailsForm.addEventListener("submit", submitMatchDetailsForm);

  // Create the boxes wrapper
  const boxesWrapper = document.createElement("div");
  boxesWrapper.className = "form-boxes-wrapper";

  // Create player one side HTML elements
  const playerOneDetailsWrapper = document.createElement("div");
  playerOneDetailsWrapper.className = "form-box";

  const playerOneHeader = document.createElement("h1");
  playerOneHeader.classList.add("player-one-head");
  const playerOneHeaderImage = document.createElement("img");
  playerOneHeaderImage.src = "./assets/x.png";
  playerOneHeaderImage.setAttribute("width", "100px");
  const playerOneHaederText = document.createElement("span");
  playerOneHaederText.textContent = "Player 1";
  playerOneHeader.appendChild(playerOneHeaderImage);
  playerOneHeader.appendChild(playerOneHaederText);

  const playerOneTag = document.createElement("label");
  playerOneTag.setAttribute("for", "player-one-name");
  playerOneTag.textContent = "Player 1 Name";

  const playerOneNameInput = document.createElement("input");
  playerOneNameInput.setAttribute("type", "text");
  playerOneNameInput.required = true;
  playerOneNameInput.id = "player-one-name";

  // Add elements to player one wrapper
  playerOneDetailsWrapper.append(playerOneHeader);
  playerOneDetailsWrapper.append(playerOneTag);
  playerOneDetailsWrapper.append(playerOneNameInput);

  // Create player two side HTML elements
  const playerTwoDetailsWrapper = document.createElement("div");
  playerTwoDetailsWrapper.className = "form-box";

  const playerTwoHeader = document.createElement("h1");
  playerTwoHeader.classList.add("player-two-head");
  const playerTwoHeaderImage = document.createElement("img");
  playerTwoHeaderImage.src = "./assets/o.png";
  playerTwoHeaderImage.setAttribute("width", "100px");
  const playerTwoHaederText = document.createElement("span");
  playerTwoHaederText.textContent = "Player 2";
  playerTwoHeader.appendChild(playerTwoHeaderImage);
  playerTwoHeader.appendChild(playerTwoHaederText);

  const playerTwoTag = document.createElement("label");
  playerTwoTag.setAttribute("for", "player-two-name");
  playerTwoTag.textContent = "Player 2 Name";

  const playerTwoNameInput = document.createElement("input");
  playerTwoNameInput.id = "player-two-name";
  playerTwoNameInput.setAttribute("type", "text");
  playerTwoNameInput.required = true;

  // Add elements to player two wrapper
  playerTwoDetailsWrapper.append(playerTwoHeader);
  playerTwoDetailsWrapper.append(playerTwoTag);
  playerTwoDetailsWrapper.append(playerTwoNameInput);

  // Append boxes to the wrapper
  boxesWrapper.appendChild(playerOneDetailsWrapper);
  boxesWrapper.appendChild(playerTwoDetailsWrapper);

  // Create the submit button
  const submitButton = document.createElement("button");
  submitButton.textContent = "Jump to the match!";
  submitButton.type = "submit";

  submitButton.addEventListener("click", () =>
    // moveToRouteHandler("/playgound")
    {}
  );

  submitButton.addEventListener("mousedown", (e) =>
    handleMouseDownOnButton(e, "#906C29")
  );
  submitButton.addEventListener("mouseup", (e) =>
    handleMouseUpOnButton(e, "#906C29")
  );

  // Append wrapper to the from
  matchDetailsForm.appendChild(boxesWrapper);
  matchDetailsForm.appendChild(submitButton);

  // Append elements to the parent element
  matchDetailsRoot.appendChild(matchDetialsPageHeader);
  matchDetailsRoot.appendChild(matchDetailsForm);

  return matchDetailsRoot;
};

// Generating Game-Playground page tamplate
const genGamePlaygroundTemplate = () => {
  const allMatches = JSON.parse(localStorage.getItem("matches-data"));

  const createdMatch = allMatches[allMatches.length - 1];
  /* Math Data Object Structure 

      {
        id: 'rvypnhapi7yclg6q807q18af62ark5c8wkvm',
        matchDate: 1659560929771, 
        playerOneName: 'Amgad', 
        playerTwoName: 'Tarek', 
        score: {
          playerOne: 0,
          playerTwo: 0,
          ties: 0,
        },
      }
  */

  console.log(createdMatch);
  /* Creating DOM Elements
  ======================== */
  const playgroundRoot = document.createElement("center");
  playgroundRoot.classList.add("playground-page");

  // Create the players data DOM elements
  const playerOneName = document.createElement("h2");
  playerOneName.classList.add("player-one-name");
  playerOneName.textContent = createdMatch.playerOneName;

  const playerTwoName = document.createElement("h2");
  playerTwoName.classList.add("player-two-name");
  playerTwoName.textContent = createdMatch.playerTwoName;

  const vsTag = document.createElement("h1");
  vsTag.classList.add("vs-tag");
  vsTag.textContent = "VS";

  const playersContainer = document.createElement("div");
  playersContainer.classList.add("players-contianer");

  playersContainer.appendChild(playerOneName);
  playersContainer.appendChild(vsTag);
  playersContainer.appendChild(playerTwoName);

  // Create the result DOM elements
  const scoreWrapper = document.createElement("div");
  scoreWrapper.classList.add("score-wrapper");

  const playerOneScore = document.createElement("h4");
  playerOneScore.classList.add("player-one-score");
  playerOneScore.textContent = createdMatch.score.playerOne;

  const playerTwoScore = document.createElement("h4");
  playerTwoScore.classList.add("player-two-score");
  playerTwoScore.textContent = createdMatch.score.playerTwo;

  const tieScore = document.createElement("h4");
  tieScore.classList.add("tie-score");
  tieScore.textContent = createdMatch.score.ties;

  scoreWrapper.appendChild(playerOneScore);
  scoreWrapper.appendChild(tieScore);
  scoreWrapper.appendChild(playerTwoScore);

  // Creating the controls DOM elements
  const controlsWrapper = document.createElement("div");
  controlsWrapper.classList.add("controls-wrapper");

  const logo = document.createElement("img");
  logo.src = "./assets/logo.png";

  const currentTurn = document.createElement("p");
  currentTurn.classList.add("current-turn");
  currentTurn.innerHTML = `
      <img src="./assets/${CURRENT_PLAYER === 1 ? "x" : "o"}.png"/>
      <span>Turn</span>
  `;

  const resetBoardButton = document.createElement("button");
  resetBoardButton.id = "reset-board";
  resetBoardButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 24 30">
  <path id="Icon_material-replay" data-name="Icon material-replay" d="M18,7.5v-6L10.5,9,18,16.5v-6a9,9,0,1,1-9,9H6a12,12,0,1,0,12-12Z" transform="translate(-6 -1.5)" fill="#192a32"/>
  </svg>
  `;
  resetBoardButton.addEventListener("click", resetBoardHandler);
  resetBoardButton.addEventListener("mousedown", (e) =>
    handleMouseDownOnButton(e, "#7c8d98")
  );
  resetBoardButton.addEventListener("mouseup", (e) =>
    handleMouseUpOnButton(e, "#7c8d98")
  );

  controlsWrapper.appendChild(logo);
  controlsWrapper.appendChild(currentTurn);
  controlsWrapper.appendChild(resetBoardButton);

  // Create the playgroung DOM elements
  const playgroundWrapper = document.createElement("div");
  playgroundWrapper.classList.add("playgournd-wrapper");

  for (let i = 0; i < 9; i++) {
    const playgroundSquare = document.createElement("div");
    playgroundSquare.classList.add("playgournd-square");
    playgroundSquare.classList.add("available");
    playgroundSquare.id = "square-" + i;
    playgroundSquare.addEventListener("click", hitSquare);
    playgroundWrapper.appendChild(playgroundSquare);
  }

  playgroundRoot.appendChild(playersContainer);
  playgroundRoot.appendChild(scoreWrapper);
  playgroundRoot.appendChild(controlsWrapper);
  playgroundRoot.appendChild(playgroundWrapper);

  return playgroundRoot;
};

// Generating Match-Result page template
const genRoundResultTemplate = (winner) => {
  /* Create DOM elements
  ====================== */
  // Create the root element
  const shadowWrapper = document.createElement("div");
  shadowWrapper.classList.add("round-result-shadow");

  // Create result box
  const resultBox = document.createElement("center");
  resultBox.classList.add("result-box");

  const roundState = document.createElement("p");
  roundState.textContent = "Round Ended !".toUpperCase();

  const winnerHolder = document.createElement("h1");

  const winnerShape = document.createElement("img");
  winnerShape.src = `./assets/${winner?.playerNumber == 1 ? "x" : "o"}.png`;

  const winnerName = document.createElement("span");
  winnerName.classList.add("winner-player-" + winner?.playerNumber);
  winnerName.textContent =
    `${winner?.playerName} takes the round !`.toUpperCase();

  const tieHolder = document.createElement("h1");
  tieHolder.classList.add("tie");
  tieHolder.textContent = "This rounded ended with a tie".toUpperCase();

  const quitButton = document.createElement("button");
  quitButton.id = "quit-match";
  quitButton.textContent = "QUIT!";
  quitButton.addEventListener("click", () => {
    continueTheMatchAndUpdateScore(winner?.playerNumber || 0);
    moveToRouteHandler("/");
  });
  quitButton.addEventListener("mousedown", (e) => {
    handleMouseDownOnButton(e, "#646E74");
  });
  quitButton.addEventListener("mouseup", (e) => {
    handleMouseUpOnButton(e, "#646E74");
  });

  const nextRoundButton = document.createElement("button");
  nextRoundButton.id = "next-round";
  nextRoundButton.textContent = "NEXT ROUND!";
  nextRoundButton.addEventListener("click", () => {
    continueTheMatchAndUpdateScore(winner?.playerNumber || 0);
    moveToRouteHandler("/match/playground");
  });
  nextRoundButton.addEventListener("mousedown", (e) => {
    handleMouseDownOnButton(e, "#906C29");
  });
  nextRoundButton.addEventListener("mouseup", (e) => {
    handleMouseUpOnButton(e, "#906C29");
  });

  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.classList.add("buttons-wrapper");

  buttonsWrapper.appendChild(quitButton);
  buttonsWrapper.appendChild(nextRoundButton);

  winnerHolder.appendChild(winnerShape);
  winnerHolder.appendChild(winnerName);

  resultBox.appendChild(roundState);

  if (winner) {
    resultBox.appendChild(winnerHolder);
  } else {
    resultBox.appendChild(tieHolder);
  }

  resultBox.appendChild(buttonsWrapper);

  shadowWrapper.appendChild(resultBox);

  return shadowWrapper;
};

// Generating the 404 page not found route
const gen404Template = () => {};

/* Handling the current view
============================ */
const handlingCurrentView = () => {
  // Rendering the view based on the current route
  app.innerHTML = "";
  switch (currnetRoute) {
    case "/":
      app.appendChild(genHomeTemplate());
      break;

    case "/match-details":
      app.appendChild(genMatchDetailsTemplate());
      break;

    case "/match/playground":
      app.appendChild(genGamePlaygroundTemplate());
      break;

    default:
      console.log("PAGE NOT FOUND!");
      break;
  }
};

/* Defining the main game function and initialzing it
===================================================== */
// The main game function
const game = () => {
  handlingCurrentView();
};

// Inatilizing the game
game();
