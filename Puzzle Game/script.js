/*
 * IDB Programming: Code Playground
 *
 */

let upKey = false;
let downKey = false;
let leftKey = false;
let rightKey = false;
let centerKey = false;

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
  // cubes[0][2].el.style.backgroundColor = colors.orange;

  window.requestAnimationFrame(loop);
}


function createCubeObjects() {
  for (let i = 1; i <= 9; i++) {
    cubeObjects[`c${i}`] = {
      el: document.getElementById(`cube${i}`),
      color: "",
      x: 0,
      y: 0
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
    cubes[i][row].el.style.backgroundColor = color;
  }
}

function keyPressed(event) {
  // Up
  if (event.code == "KeyW") {
    upKey = true;
  }
  if (upKey == true) {
    if (event.code == "KeyQ") { // Up - Left
      console.log("Up - Left")
    } else if (event.code == "KeyE") { // Up - Right
      console.log("Up - Right")
    }
  }

  // Down
  if (event.code == "KeyX") {
    downKey = true;
  }
  if (downKey == true) {
    if (event.code == "KeyZ") { // Down - Left
      console.log("Down - Left")
    } else if (event.code == "KeyC") { // Down - Right
      console.log("Down - Right")
    }
  }

  // Left
  if (event.code == "KeyA") {
    leftKey = true;
  }
  if (leftKey == true) {
    if (event.code == "KeyQ") { // Left - Up
      console.log("Left - Up")
    } else if (event.code == "KeyZ") { // Left - Down
      console.log("Left - Down")
    }
  }

  // Right
  if (event.code == "KeyD") {
    rightKey = true;
  }
  if (rightKey == true) {
    if (event.code == "KeyE") { // Right - Up
      console.log("Right - Up")
    } else if (event.code == "KeyC") { // Right - Down
      console.log("Right - Down")
    }
  }

  // Center
  if (event.code == "KeyS") {
    centerKey = true;
  }
  if (centerKey == true) {
    if (event.code == "KeyW") { // Center - Up
      console.log("Center - Up")
    } else if (event.code == "KeyX") { // Center - Down
      console.log("Center - Down")
    } else if (event.code == "KeyA") { // Center - Left
      console.log("Center - Left")
    } else if (event.code == "KeyD") { // Center - Right
      console.log("Center - Right")
    }
  }
}

function keyReleased(event) {
  // Up
  if (event.code == "KeyW") {
    upKey = false;
  }
  // Down
  if (event.code == "KeyX") {
    downKey = false;
  }
  // Left
  if (event.code == "KeyA") {
    leftKey = false;
  }
  // Right
  if (event.code == "KeyD") {
    rightKey = false;
  }
  // Center
  if (event.code == "KeyS") {
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
  setCubesColor(0, colors.orange);
  setCubesColor(1, colors.green);
  setCubesColor(2, colors.purple);

  document.addEventListener("keydown", keyPressed);
  document.addEventListener("keyup", keyReleased);

  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!
