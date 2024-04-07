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
var centerHorz, centerVert;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

let angleY = 0;
let angleX = 3.14;
let angleZ = 0;

let xRotMax = 0.003;
let yRotMax = 0.15;
let zRotMax = 0.003;

let n = 4;
let teapots = [];

function preload() {
  teapotObj = loadModel('../assets/teapot.obj');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  let posXScale = width/100;
  let posYScale = height/100;

  // Create objects
  for (i=0; i<n; i++) {
    let thisPos = createVector(random(-posXScale,posXScale),
                               random(-posYScale,posYScale),
                               random(-posXScale,posXScale));
    let thisDelta = createVector(random(xRotMax/2,xRotMax), 
                                 random(yRotMax/2,yRotMax), 
                                 random(zRotMax/2,zRotMax));
    teapots[i] = new Thing(teapotObj, 30, thisPos, thisDelta);
  }
}

function draw() {
  // Set the background color
  background(0);
  
  push();
  noStroke();
  translate(0,0,-1000);
  plane(width * 2.3, height * 2.3);
  pop();
  
  // scale everything
  scale(25);
  
  //set the  light 
  pointLight(232,142,2, -500, -100, 250);
  ambientLight(221,225,236,128);
  noStroke();
  
  
  for (i=0; i<n; i++) {
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

