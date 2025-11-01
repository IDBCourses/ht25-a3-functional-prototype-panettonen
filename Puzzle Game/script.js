/*
 * Puzzle Game
 *
 * IxD HT25
 * A3: Functional Prototype
 * 
 */

let solvedByUser = false;
let puzzleSolved = false; // When true: Moves don't count

// Timer
const zero = 0;
const timeText = document.getElementById("time");

let timeShow = zero.toFixed(2);
let timeSwitch;

let timeStart;
let timeElapsed;

let hideTimer = false;
let hideTimerKey = "t";

// Moves
const movesText = document.getElementById("moves");

let movesTotal = 0;
let hideMoves = false;
let hideMovesKey = "v";

// Keys
let upKey = false;
let downKey = false;
let leftKey = false;
let rightKey = false;
let centerKey = false;

const moves = {
  upLeft: false,
  upRight: false,
  downLeft: false,
  downRight: false,

  leftUp: false,
  leftDown: false,
  rightUp: false,
  rightDown: false,

  centerUp: false,
  centerDown: false,
  centerLeft: false,
  centerRight: false
};

// keys[x][y] - Reversed the list so the first number is x
let keys = [
  ["KeyQ", "KeyA", "KeyZ"],
  ["KeyW", "KeyS", "KeyX"],
  ["KeyE", "KeyD", "KeyC"]
];

// keysColor[y][x] - List not reversed
let keyRowsMap = [
  ["Digit6", "Digit7", "Digit8", "Digit9"],
  ["KeyY", "KeyU", "KeyI", "KeyO"],
  ["KeyH", "KeyJ", "KeyK", "KeyL"],
  ["KeyN", "KeyM", "Comma", "Period"]
]

const keyRows = {
  r1: {
    press: false,
    havePressed: false,
    time: null
  },
  r2: {
    press: false,
    havePressed: false,
    time: null
  },
  r3: {
    press: false,
    havePressed: false,
    time: null
  },
  r4: {
    press: false,
    havePressed: false,
    time: null
  }
}

const keyRowsAmount = Object.keys(keyRows).length;
const swipeRowsTimeLimit = 200;
let haveSwiped = false;

const randomizeKey = "Space";
let randomize = false;

const resetKey = "Enter";
let resetCube = false;

// Cubes
let cubeObjects = {};
let cubes = [];

const cubeSize = 70;
const cubeSizeGap = 8;
const cubeSizeMarginX = 170;
const cubeSizeMarginY = 100;

// Indicators
const indicators = {};
const indicatorSize = cubeSize * 0.4;
const indicatorMargin = cubeSize * 1.05;

const indicatorSolvedSize = cubeSize * 0.22; 
const indicatorSolvedMargin = cubeSize * 0.2; 

// Colors
const colors = {
  scheme1: {
    c1: "#33A6B8",
    c2: "#FB9966",
    c3: "#FFFFFF",
    solved: "#A7C080",
    text: "#FFFFFF"
  },
  scheme2: {
    c1: "#F5ECC2",
    c2: "#F3A257",
    c3: "#B09F36",
    solved: "#B09F36",
    text: "#F5ECC2"
  }, 
  scheme3: {
    c1: "#FDD4BD",
    c2: "#B2B73E",
    c3: "#B4CDC2",
    solved: "#B2B73E",
    text: "#FFE5D7"
  }, 
  scheme4: {
    c1: "#F37F94",
    c2: "#FDD4BD",
    c3: "#AFD472",
    solved: "#AFD472",
    text: "#FFE7D9"
  }
};

const cSchemesAmount = Object.keys(colors).length;
let cSchemesIndex = 1;

let currentColors = colors.scheme1;
let prevColors;


// Code that runs over and over again
function loop() {
  checkRowSwipe();

  if (haveSwiped) {
    changeColorScheme();
    haveSwiped = false;
  }

  moveColors();
  drawCubes();

  if (resetCube) {
    resetColors();
    solvedByUser = false;
    timeSwitch = false;
    timeShow = zero.toFixed(2);
    movesTotal = 0;
    puzzleSolved = false;

    resetCube = false;
  }

  if (randomize) {
    randomizeColors(50);
    solvedByUser = true;
    timeStart = performance.now();
    timeSwitch = true;
    movesTotal = 0;
    puzzleSolved = false;

    randomize = false;
  }

  if (timeSwitch) {
    timeElapsed = performance.now() - timeStart;
    timeShow = (timeElapsed / 1000).toFixed(2);
  }

  checkIfSolved();
  drawTimeText();
  drawMovesText();
  setIndicatorSolved();

  window.requestAnimationFrame(loop);
}


function checkRowSwipe() {
  getKeyRowsTime();

  const row1Row2 = checkTimeDiff(keyRows.r1, keyRows.r2);
  const row2Row3 = checkTimeDiff(keyRows.r2, keyRows.r3);
  const row3Row4 = checkTimeDiff(keyRows.r3, keyRows.r4);

  if (row1Row2 && row2Row3 || row2Row3 && row3Row4) {
    haveSwiped = true;

    // Remove the saved time for when the keys was pressed
    for (let i = 1; i <= keyRowsAmount; i++) {
      keyRows[`r${ i }`].time = null;
    }
  }
}

function getKeyRowsTime() {
  for (let i = 1; i <= keyRowsAmount; i++) {
    const row = `r${ i }`;

    if (keyRows[row].press) {
      if (!keyRows[row].havePressed) {
        keyRows[row].time = performance.now();
        keyRows[row].havePressed = true; // keyUp event make it false again
      }
    }
  }
}

function checkTimeDiff(row1, row2) {
  if (row2.time - row1.time < swipeRowsTimeLimit && 
      row2.time - row1.time > 0) {
    return true;
  } else {
    return false;
  }
}

function changeColorScheme() {
  prevColors = currentColors;

  if (cSchemesIndex < cSchemesAmount) {
    cSchemesIndex++;
  } else if (cSchemesIndex == cSchemesAmount) {
    cSchemesIndex = 1;
  }

  currentColors = colors[`scheme${ cSchemesIndex }`];

  // Cubes
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (cubes[x][y].color == prevColors.c1) {
        cubes[x][y].color = currentColors.c1;
      } else if (cubes[x][y].color == prevColors.c2) {
        cubes[x][y].color = currentColors.c2;
      } else if (cubes[x][y].color == prevColors.c3) {
        cubes[x][y].color = currentColors.c3;
      }
    }
  }

  // Indicators
  indicators.r1.el.style.backgroundColor = currentColors.c1;
  indicators.r2.el.style.backgroundColor = currentColors.c2;
  indicators.r3.el.style.backgroundColor = currentColors.c3;
}

function moveColors() {
  // Up
  if (moves.upLeft) {
    move(2, 0, 1, 0, 0, 0);
    moves.upLeft = false;
  } else if (moves.upRight) {
    move(0, 0, 1, 0, 2, 0);
    moves.upRight = false;
  }
  
  // Down
  if (moves.downLeft) {
    move(2, 2, 1, 2, 0, 2);
    moves.downLeft = false;
  } else if (moves.downRight) {
    move(0, 2, 1, 2, 2, 2);
    moves.downRight = false;
  }

  // Left
  if (moves.leftUp) {
    move(0, 2, 0, 1, 0, 0);
    moves.leftUp = false;
  } else if (moves.leftDown) {
    move(0, 0, 0, 1, 0, 2);
    moves.leftDown = false;
  }

  // Right
  if (moves.rightUp) {
    move(2, 2, 2, 1, 2, 0);
    moves.rightUp = false;
  } else if (moves.rightDown) {
    move(2, 0, 2, 1, 2, 2);
    moves.rightDown = false;
  }

  // Center
  if (moves.centerUp) {
    move(1, 2, 1, 1, 1, 0);
    moves.centerUp = false;
  } else if (moves.centerDown) {
    move(1, 0, 1, 1, 1, 2);
    moves.centerDown = false;
  } else if (moves.centerLeft) {
    move(2, 1, 1, 1, 0, 1);
    moves.centerLeft = false;
  } else if (moves.centerRight) {
    move(0, 1, 1, 1, 2, 1);
    moves.centerRight = false;
  }
}

function move(x1, y1, x2, y2, x3, y3) {
  let temp1 = cubes[x1][y1].color;
  let temp2 = cubes[x2][y2].color;
  let temp3 = cubes[x3][y3].color;

  cubes[x1][y1].color = temp3;
  cubes[x2][y2].color = temp1;
  cubes[x3][y3].color = temp2;

  if (!puzzleSolved) {
    movesTotal++;
  }
}

function drawCubes() {
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      cubes[x][y].el.style.backgroundColor = cubes[x][y].color;
    }
  }
}

function randomizeColors(turns) {
  for (let i = 0; i < turns; i++) {
    let pos1 = getRandomPos();
    let pos2 = getRandomPos();
    let samePosition = true; // To get into the loop

    while (samePosition) {
      if (pos1.x == pos2.x && pos1.y == pos2.y) {
        pos2 = getRandomPos();
      } else {
        samePosition = false;
      }
    }

    switchTwoColors(pos1, pos2);
  }
}

function getRandomPos() {
  let xValue = Math.floor(Math.random() * 3);
  let yValue = Math.floor(Math.random() * 3);

  return {x: xValue, y: yValue};
}

function switchTwoColors(position1, position2) {
  const p1 = position1;
  const p2 = position2;

  let tempColor1 = cubes[p1.x][p1.y].color;
  let tempColor2 = cubes[p2.x][p2.y].color;

  cubes[p1.x][p1.y].color = tempColor2;
  cubes[p2.x][p2.y].color = tempColor1;
}

function checkIfSolved() {
  let firstRowSolved = [];
  let secondRowSolved = [];
  let thirdRowSolved = [];

  for (let i = 0; i < 3; i++) {
    if (cubes[i][0].color == currentColors.c1) {
      firstRowSolved.push(1);
    }
    if (cubes[i][1].color == currentColors.c2) {
      secondRowSolved.push(1);
    }
    if (cubes[i][2].color == currentColors.c3) {
      thirdRowSolved.push(1);
    }
  }
  
  if (firstRowSolved.length == 3 && 
      secondRowSolved.length == 3 && 
      thirdRowSolved.length == 3 && 
      solvedByUser) {
    indicators.s.el.style.backgroundColor = currentColors.solved;
    timeSwitch = false;
    puzzleSolved = true;
  } else {
    indicators.s.el.style.backgroundColor = "unset";
  }
}

function drawTimeText() {
  if (hideTimer) {
    timeText.style.color = "transparent";
    timeText.style.userSelect = "none";
  } else {
    timeText.style.color = currentColors.text;
    timeText.style.userSelect = "all";
  }
  
  timeText.style.fontSize = `${ cubeSize / 2 }px`;
  timeText.textContent = timeShow;

  timeText.style.translate = 
    `${ cubeSizeMarginX + 3 * cubeSize + 2 * cubeSizeGap - timeText.offsetWidth}px 
    ${ cubeSizeMarginY + 3 * cubeSize + 3 * cubeSizeGap + cubeSize * 0.4 }px`
}

function drawMovesText() {
  let movesTextMargin;

  if (hideMoves) {
    movesText.style.color = "transparent";
    movesText.style.userSelect = "none";
  } else {
    movesText.style.color = currentColors.text;
    movesText.style.userSelect = "all";
  }
  
  movesText.style.fontSize = `${ cubeSize / 2 }px`;
  movesText.textContent = movesTotal;

  if (hideTimer) {
    movesTextMargin = 0;
  } else {
    movesTextMargin = cubeSize / 2 + cubeSize * 0.15;
  }

  movesText.style.translate = 
    `${ cubeSizeMarginX + 3 * cubeSize + 2 * cubeSizeGap - movesText.offsetWidth}px 
    ${ cubeSizeMarginY + 3 * cubeSize + 3 * cubeSizeGap + cubeSize * 0.4 + movesTextMargin }px`
}


function createCubeObjects() {
  for (let i = 1; i <= 9; i++) {
    cubeObjects[`c${ i }`] = {
      el: document.getElementById(`cube${ i }`),
      color: ""
    }
  }
}

function setCubesObjects() {
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      cubes[x][y].el.style.width = `${ cubeSize }px`;
      cubes[x][y].el.style.height = `${ cubeSize }px`;

      cubes[x][y].el.style.translate = 
        `${ cubeSizeMarginX + x * cubeSize + x * cubeSizeGap }px 
        ${ cubeSizeMarginY + y * cubeSize + y * cubeSizeGap }px`
    }
  }
}

function setCubesColor(row, color) {
  for (let i = 0; i < 3; i++) {
    cubes[i][row].color = color;
  }
}

function resetColors() {
  setCubesColor(0, currentColors.c1);
  setCubesColor(1, currentColors.c2);
  setCubesColor(2, currentColors.c3);

  indicators.r1.el.style.backgroundColor = currentColors.c1;
  indicators.r2.el.style.backgroundColor = currentColors.c2;
  indicators.r3.el.style.backgroundColor = currentColors.c3;

  indicators.s.el.style.backgroundColor = "unset";
}

function createIndicators() {
  for (let i = 1; i <= 3; i++) {
    indicators[`r${ i }`] = {
      el: document.getElementById(`ind${ i }`)
    }
  }

  indicators["s"] = {
    el: document.getElementById("ind-solved")
  }
}

function setIndicator(ind, row) {
  ind.el.style.width = `${ indicatorSize }px`;
  ind.el.style.height = `${ indicatorSize }px`;
  
  ind.el.style.translate = 
    `${ cubeSizeMarginX - indicatorMargin }px 
    ${ cubeSizeMarginY + cubeSize / 2 - indicatorSize / 2 + row * cubeSize + row * cubeSizeGap }px`
}

function setIndicatorSolved() {
  let xPos;
  let indSize = indicatorSolvedSize;

  if (hideTimer && hideMoves) {
    indSize *= 1.2;
    xPos = cubeSizeMarginX + 3 * cubeSize + 2 * cubeSizeGap - indSize;
  } else {
    xPos = cubeSizeMarginX + 3 * cubeSize + 3 * cubeSizeGap + indicatorSolvedMargin;
  }

  indicators.s.el.style.width = `${ indSize }px`;
  indicators.s.el.style.height = `${ indSize }px`;
  indicators.s.el.style.borderRadius = "50%";

  indicators.s.el.style.translate = 
    `${ xPos }px 
    ${ cubeSizeMarginY + 3 * cubeSize + 3 * cubeSizeGap + cubeSize * 0.4 + cubeSize / 4 - indicatorSolvedSize / 2 + cubeSize * 0.085 }px` // cubeSize * 0.085 is for ofsetting the circle for the font Jetbrains Mono
}

function keyPressed(event) {
  // Up
  if (event.code == keys[1][0]) {
    upKey = true;
  }
  if (upKey == true) {
    if (event.code == keys[0][0]) { // Up - Left
      moves.upLeft = true;
    } else if (event.code == keys[2][0]) { // Up - Right
      moves.upRight = true;
    }
  }

  // Down
  if (event.code == keys[1][2]) {
    downKey = true;
  }
  if (downKey == true) {
    if (event.code == keys[0][2]) { // Down - Left
      moves.downLeft = true;
    } else if (event.code == keys[2][2]) { // Down - Right
      moves.downRight = true;
    }
  }

  // Left
  if (event.code == keys[0][1]) {
    leftKey = true;
  }
  if (leftKey == true) {
    if (event.code == keys[0][0]) { // Left - Up
      moves.leftUp = true;
    } else if (event.code == keys[0][2]) { // Left - Down
      moves.leftDown = true;
    }
  }

  // Right
  if (event.code == keys[2][1]) {
    rightKey = true;
  }
  if (rightKey == true) {
    if (event.code == keys[2][0]) { // Right - Up
      moves.rightUp = true;
    } else if (event.code == keys[2][2]) { // Right - Down
      moves.rightDown = true;
    }
  }

  // Center
  if (event.code == keys[1][1]) {
    centerKey = true;
  }
  if (centerKey == true) {
    if (event.code == keys[1][0]) { // Center - Up
      moves.centerUp = true;
    } else if (event.code == keys[1][2]) { // Center - Down
      moves.centerDown = true;
    } else if (event.code == keys[0][1]) { // Center - Left
      moves.centerLeft = true;
    } else if (event.code == keys[2][1]) { // Center - Right
      moves.centerRight = true;
    }
  }

  // Reset
  if (event.code == resetKey) {
    resetCube = true;
  }

  // Random
  if (event.code == randomizeKey) {
    randomize = true;
  }

  // Timer
  if (event.key == hideTimerKey) {
    if (hideTimer) {
      hideTimer = false;
    } else {
      hideTimer = true;
    }
  }

  // Moves
  if (event.key == hideMovesKey) {
    if (hideMoves) {
      hideMoves = false;
    } else {
      hideMoves = true;
    }
  }

  // Rows
  for (let i = 0; i < keyRowsAmount; i++) {
    const row = `r${ i + 1 }`;

    if (keyRowsMap[i].includes(event.code)) {
      keyRows[row].press = true;
    }
  }
}

function keyReleased(event) {
  // Up
  if (event.code == keys[1][0]) {
    upKey = false;
  }
  // Down
  if (event.code == keys[1][2]) {
    downKey = false;
  }
  // Left
  if (event.code == keys[0][1]) {
    leftKey = false;
  }
  // Right
  if (event.code == keys[2][1]) {
    rightKey = false;
  }
  // Center
  if (event.code == keys[1][1]) {
    centerKey = false;
  }
  // Rows
  for (let i = 0; i < keyRowsAmount; i++) {
    const row = `r${ i + 1 }`;

    if (keyRowsMap[i].includes(event.code)) {
      keyRows[row].press = false;
      keyRows[row].havePressed = false;
    }
  }
}

// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  createCubeObjects();

  cubes = [
    [cubeObjects.c1, cubeObjects.c4, cubeObjects.c7],
    [cubeObjects.c2, cubeObjects.c5, cubeObjects.c8],
    [cubeObjects.c3, cubeObjects.c6, cubeObjects.c9]
  ];

  setCubesObjects();

  createIndicators();
  setIndicator(indicators.r1, 0);
  setIndicator(indicators.r2, 1);
  setIndicator(indicators.r3, 2);
  setIndicatorSolved();

  resetColors();

  document.addEventListener("keydown", keyPressed);
  document.addEventListener("keyup", keyReleased);

  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!
