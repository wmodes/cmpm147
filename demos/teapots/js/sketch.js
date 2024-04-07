// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
let centerHorz, centerVert;

const angleY = 0;
const angleX = 3.14;
const angleZ = 0;

const xRotMax = 0.003;
const yRotMax = 0.15;
const zRotMax = 0.003;

const numTeapots = 3;
let teapotObj;
let teapots = [];

function modelLoaded() {
  console.log('Teapot model loaded successfully.');
}

function modelError(error) {
  console.error('Error loading teapot model:', error);
}

function preload() {
  teapotObj = loadModel('assets/teapot.obj', modelLoaded, modelError);
}

function windowResized() {
  resizeScreen();
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  redrawCanvas(); // Redraw everything based on new size
}

function redrawCanvas() {
  // Adjust canvas size to container's current dimensions
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  
  // Recalculate scale factors based on new canvas size
  const posXScale = canvasContainer.width() / 100;
  const posYScale = canvasContainer.height() / 100;
  
  // Recreate objects with new position scales if their positioning is dependent on canvas size
  teapots = []; // Reset the array if you're going to repopulate it
  for (let i = 0; i < numTeapots; i++) {
    const thisPos = createVector(random(-posXScale, posXScale),
                               random(-posYScale, posYScale),
                               random(-posXScale, posXScale));
    const thisDelta = createVector(random(xRotMax / 2, xRotMax), 
                                 random(yRotMax / 2, yRotMax), 
                                 random(zRotMax / 2, zRotMax));
    teapots[i] = new Thing(teapotObj, 30, thisPos, thisDelta);
  }
  
  // Optionally, reapply global settings that might be affected by resize
  // (e.g., lights, camera positions, global scale)
}


function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  const canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
  canvas.parent("canvas-container");

  // setup all the params for the teapots
  redrawCanvas();
}

function draw() {
  clear();
  
  // scale everything
  scale(25);
  
  //set the  light 
  pointLight(232,142,2, -500, -100, 250);
  ambientLight(221,225,236,128);
  noStroke();
  
  
  for (let i=0; i<numTeapots; i++) {
    push();
    teapots[i].rotate();
    teapots[i].display();
    pop();
  }
}

// Thing class
class Thing {
  constructor(modelObj, scale, posVector, deltaVector) {
    this.model = modelObj;
    this.pos = posVector;
    this.angle = createVector(3.14, 0, 0)
    this.delta = deltaVector;
    this.scale = scale;
  }

  rotate() {
    // Rotate the model around the x-axis
    rotateX(this.angle.x);
    // Rotate the model around the y-axis
    rotateY(this.angle.y);
    // Rotate the model around the z-axis
    rotateZ(this.angle.z);
    // Increase the angles for the next frame
    this.angle = p5.Vector.add(this.angle, this.delta);
  }

  display() {
    translate(this.pos.x, this.pos.y, this.pos.z);
    // Draw the model
    ambientMaterial(73,121,116);
    model(this.model);
  }
}

