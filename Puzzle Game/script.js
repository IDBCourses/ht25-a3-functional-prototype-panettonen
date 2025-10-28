/*
 * IDB Programming: Code Playground
 *
 */

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

let keys = [
  ["KeyQ", "KeyA", "KeyZ"],
  ["KeyW", "KeyS", "KeyX"],
  ["KeyE", "KeyD", "KeyC"]
];

let cubeObjects = {};
let cubes = [];

const cubeSize = 75;
const cubeSizeGap = 5;
const cubeSizeMarginX = 100;
const cubeSizeMarginY = 100;

const colors = {
  orange: "#E69875",
  green: "#A7C080",
  purple: "#D699B6"
};

// Code that runs over and over again
function loop() {
  moveColors();
  drawCubes();

  window.requestAnimationFrame(loop);
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
}

function drawCubes() {
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      cubes[x][y].el.style.backgroundColor = cubes[x][y].color;
    }
  }
}


function createCubeObjects() {
  for (let i = 1; i <= 9; i++) {
    cubeObjects[`c${i}`] = {
      el: document.getElementById(`cube${i}`),
      color: ""
    }
  }
}

function setCubesObjects() {
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      cubes[x][y].el.style.width = `${cubeSize}px`;
      cubes[x][y].el.style.height = `${cubeSize}px`;

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

function resetCubesColor() {
  setCubesColor(0, colors.orange);
  setCubesColor(1, colors.green);
  setCubesColor(2, colors.purple);
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
  resetCubesColor();

  document.addEventListener("keydown", keyPressed);
  document.addEventListener("keyup", keyReleased);

  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!
