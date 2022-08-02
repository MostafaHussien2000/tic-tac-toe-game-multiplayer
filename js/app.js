import { GENERATE_RANDOM_ID } from "./helpers.js";

/* GLOBAL VArIABLES
=================== */
let currnetRoute = "/";
const ALL_ROUTES = [
  "/",
  "/match-details",
  "/playground",
  "/playground/round-result",
];

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
    id: GENERATE_RANDOM_ID(),
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
};

/* Generating all app templates
=============================== */
// Generating Home page temlpate
const genHomeTemplate = () => {
  /* Creating DOM Elements
  ======================== */
  const homePageCenter = document.createElement("center");
  homePageCenter.classList.add("home-page");

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
  homePageCenter.appendChild(homePageHeader);
  homePageCenter.appendChild(headerH1);
  homePageCenter.appendChild(homeParagraph);
  homePageCenter.appendChild(startGameButton);

  return homePageCenter;
};

// Generating Start-Game page temlpate
const genMatchDetailsTemplate = () => {
  /* Creating DOM Elements
  ======================== */
  const matchDetailsPageCenter = document.createElement("center");
  matchDetailsPageCenter.classList.add("match-details-page");

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
  matchDetailsPageCenter.appendChild(matchDetialsPageHeader);
  matchDetailsPageCenter.appendChild(matchDetailsForm);

  return matchDetailsPageCenter;
};

// Generating Game-Playground page tamplate
const genGamePlaygroundTemplate = () => {};

// Generating Match-Result page template
const genMatchResultTemplate = () => {};

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
