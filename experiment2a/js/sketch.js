// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
let forestImage;
let forestSong;
let attentionLevel;

let enableMusic = false;


// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  attentionLevel = 0;

  if (enableMusic) {
    forestSong.setVolume(0.5);
    forestSong.play();
  }

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

function preload() {
  forestImage = loadImage(
    "./assets/forest.jpg"
  );

  if (enableMusic) {
    forestSong = loadSound(
      "https://cdn.glitch.com/1c26e028-7ec7-4d36-a175-2cb5f9cf4a4a%2FForest%20Sounds%20(Prod.%20Dj%20Luxurious).mp3?v=1570076421814"
    );
  }
}

function draw() {
  let now = millis();

  let rate = 0.01;
  if (mouseIsPressed) {
    attentionLevel += rate * (4 - attentionLevel);
  } else {
    attentionLevel += rate * (0 - attentionLevel);
  }

  translate(-mouseX * attentionLevel, -mouseY * attentionLevel);
  scale(1 + attentionLevel, 1 + attentionLevel);

  let drift = 100;
  let dx = noise(now / 5000);
  let dy = noise(now / 8000);
  image(
    forestImage,
    -drift + drift * dx,
    -drift + drift * dy,
    width + drift,
    height + drift
  );

  let numBars = 64;
  let girth = width / numBars;
  noStroke();
  for (let i = 0; i < numBars; i++) {
    let x = i * girth;

    let shine = noise(now / 5000, (20 * i) / width);
    fill(255, 240, 192, 255 * shine);
    rect(x, 0, girth, height);
  }
}
