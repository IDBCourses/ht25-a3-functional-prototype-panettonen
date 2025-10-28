/*
 * IDB Programming: Code Playground
 *
 */

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
  for (let i1 = 0; i1 < 3; i1++) {
    for (let i2 = 0; i2 < 3; i2++) {
      cubes[i1][i2].el.style.width = `${cubeSize}px`;
      cubes[i1][i2].el.style.height = `${cubeSize}px`;

      cubes[i1][i2].el.style.translate = 
        `${ cubeSizeMarginX + i1 * cubeSize + i1 * cubeSizeGap }px 
        ${ cubeSizeMarginY + i2 * cubeSize + i2 * cubeSizeGap }px`
    }
  }
}

function setCubesColor(row, color) {
  for (let i = 0; i < 3; i++) {
    cubes[i][row].el.style.backgroundColor = color;
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

  document.addEventListener("keydown", listener)

  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!
