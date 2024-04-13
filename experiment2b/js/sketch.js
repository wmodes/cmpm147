// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts

//horizon
const HORIZON_LOCATION = 2/3; // The horizon line
const HORIZON_FREQ_FACTOR = 0.01;
const HORIZON_AMPLITUDE_FACTOR = 0.01;
const HORIZON_COLOR_1 = "#8E326B";
const HORIZON_COLOR_2 = "#602141";

// terrain
const TERRAIN_STEP = 5; 
const TERRAIN_FREQ_FACTOR = 0.01;
const TERRAIN_AMPLITUDE_FACTOR = 0.25;
const TERRAIN_BASE_COLOR = "#4A1A34";

// mesas
const MESA_HEIGHT_FACTOR = 1.5;
const MESA_TOP_AMPLITUDE_FACTOR = 0.25; 
const MESA_VARIATION = 20;
const MESA_START_FACTOR = 0.4;  // the percentage of the terrain above which mesas start
const MESA_BASE_COLOR = "#4A1A34";
const MESA_COLOR_1 = "#14020D";

// sky
const SKY_BASE_COLOR = "#FB610F";
const SKY_COLOR_1 = "#FFEB01";
const SKY_COLOR_2 = "#FC420F";
const SKY_COLOR_3 = "#89A3BC";

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

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  noiseSeed(millis());
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  
  let terrain = [];
  let mesas = [];
  let currentMesa = []; // Temporarily holds vertices of the current mesa
  let inMesa = false; // Flag to track whether we are currently in a mesa
  let mesaHeight = Infinity; // Track the minimum Y value within the current mesa

  let yNoiseRange = height * TERRAIN_AMPLITUDE_FACTOR; 
  let terrainBaseY = height * 2/3 + yNoiseRange;
  let terrainPeakY = height * 2/3 - yNoiseRange;
  let mesaBaseY = terrainPeakY + (terrainBaseY - terrainPeakY) * MESA_START_FACTOR;
  let localVariation = 0;

  // Initialize and check the first point
  let initialNoiseVal = noise(0 * TERRAIN_FREQ_FACTOR);
  let initialY = map(initialNoiseVal, 0, 1, terrainPeakY, terrainBaseY);
  if (initialY < mesaBaseY) {
    initialY = terrainPeakY + (initialNoiseVal * yNoiseRange * 0.5);
    inMesa = true;
  }

  // Calculate terrain and track mesas
  for (let x = 0; x < width; x += TERRAIN_STEP) { 
    let noiseVal = noise(x * TERRAIN_FREQ_FACTOR); 
    let y = map(noiseVal, 0, 1, terrainPeakY, terrainBaseY); 

    // if we are above the dynamicMidpointY, i.e. in the mesa
    if (y < mesaBaseY) {
      y = terrainPeakY + (noiseVal * yNoiseRange * MESA_TOP_AMPLITUDE_FACTOR) + localVariation;
      // flatten the top of the mesa
      // y = y * MESA_TOP_AMPLITUDE_FACTOR;
      // if we are in a mesa
      if (!inMesa) {
        inMesa = true;
        let noiseScale = 0.05; // Adjust scale to get more or less frequent changes
        localVariation = noise(x * noiseScale) * 2 * MESA_VARIATION - MESA_VARIATION;
        // mesaHeight = y; // Reset minimum Y for new mesa
        if (x > 0) { // Ensure we have a point just before the mesa starts
          currentMesa.push([x-5, map(noise((x - 5) * TERRAIN_FREQ_FACTOR), 0, 1, terrainPeakY, terrainBaseY)]);
        }
      } else {
        mesaHeight = min(mesaHeight, y); // Update the minimum Y found in this mesa
      }
      currentMesa.push([x, y]);
    } 
    // if we are not in a mesa
    else {
      // if we are exiting a mesa
      if (inMesa) {
        // const mesaLocalHeight = mesaBaseY - mesaHeight;
        // // Set all Y values to the minimum found
        // currentMesa.forEach(point => {
        //   const heightOfThisMesa = mesaBaseY - (mesaLocalHeight * MESA_HEIGHT_FACTOR);
        //   const localHeightVariation = mesaBaseY - point[1];
        //   point[1] = heightOfThisMesa - (localHeightVariation * MESA_TOP_AMPLITUDE_FACTOR);
        // });
        // set first point of mesa at baseY
        currentMesa.unshift([currentMesa[0][0], mesaBaseY]);
        //set last point of mesa at baseY
        currentMesa.push([x, mesaBaseY]); 
        // add the mesa to the mesas array
        mesas.push(currentMesa);
        // add the mesa to the terrain array
        terrain.push(...currentMesa);
        currentMesa = [];
        inMesa = false;
        localVariation = 0;
      }
      else {
        terrain.push([x, y]);
      }
    }

    
  }
  if (inMesa) {
    currentMesa.push([width, mesaBaseY]);
    mesas.push(currentMesa);
    terrain.push(...currentMesa);
  }

  // Draw the sky
  //
  drawSky();

  // Draw the horizon
  //
  drawHorizon(0, color(HORIZON_COLOR_1));
  drawHorizon(10, lerpColor(color(HORIZON_COLOR_1), color(HORIZON_COLOR_2), 0.33));
  drawHorizon(20, lerpColor(color(HORIZON_COLOR_1), color(HORIZON_COLOR_2), 0.66));
  drawHorizon(30, color(HORIZON_COLOR_2));

  // draw the terrain
  //
  drawTerrain(terrain);

  // draw the mesas
  //
  drawMesas(mesas);
}

function drawSky() {
  background(SKY_BASE_COLOR); // Base color

  let colors = [color(SKY_COLOR_1), color(SKY_COLOR_2), color(SKY_COLOR_3)];
  let maxY = height * 0.6; // Maximum y to start streaks
  let minY = 0; // Minimum y to start streaks
  let maxStreakHeight = 20; // Maximum height of a streak

  for (let y = minY; y < maxY; y += noise(y * 0.1) * maxStreakHeight) {
    let streakLength = noise(y * 0.05) * width; // Variable streak length
    let streakHeight = noise(y * 0.1) * maxStreakHeight; // Variable streak height
    let startX = noise(y * 0.1) * (width - streakLength); // Start position varies

    // Determine color based on height
    let colorIndex = floor(noise(y * 0.1) * colors.length);
    let c1 = colors[colorIndex % colors.length];
    let c2 = colors[(colorIndex + 1) % colors.length];
    let interp = noise(y * 0.1) * (colors.length - 1) - floor(noise(y * 0.1) * (colors.length - 1));
    let streakColor = lerpColor(c1, c2, interp);

    fill(streakColor);
    noStroke();
    rect(startX, y, streakLength, streakHeight);
  }
}


function drawHorizon(offset, color) {
  fill(color); // Set fill color for the horizon
  noStroke(); // Turn off stroke
  beginShape();
  vertex(0, height);
  for (let x = 0; x < width; x += 5) { 
    let noiseVal = noise(x * HORIZON_FREQ_FACTOR); 
    let y = offset + map(noiseVal, 0, 1, height * HORIZON_LOCATION - height * HORIZON_AMPLITUDE_FACTOR, height * HORIZON_LOCATION + height * HORIZON_AMPLITUDE_FACTOR); 
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);
}

function drawTerrain(terrain) {
  stroke(HORIZON_COLOR_1); // Set stroke color to red
  strokeWeight(2); // Set the thickness of the line
  fill(TERRAIN_BASE_COLOR);
  beginShape();
  vertex(0, height); // Start at the bottom left corner
  for (const [x, y] of terrain) {
    vertex(x, y); // Draw each point in the terrain
  }
  vertex(width, height); // End at the bottom right corner
  endShape(CLOSE);
}

function drawMesas(mesas) {
  stroke(255,255,255);
  // noFill();
  noStroke(); // No outline for the mesas to give a clean fill look
  fill(MESA_COLOR_1); // Set the fill color for the mesas

  mesas.forEach(mesa => {
      if (mesa.length === 0) return; // go to next one if no points

      // determine the dynamicMidpointY
      const mesaBottomY = mesa[0][1];

      beginShape(); // begin shape

      // first point is mesa[0]x, dynamicMidpointY
      vertex(mesa[0][0], mesaBottomY);

      const period1 = 5;
      const period2 = 3.75;
      const period3 = 1.4;
      const amplitudeFactor = 1.2; // set the amplitude factor of sine

      // loop over the points in mesa
      mesa.forEach(([x, y], index) => {
          // console.log(`\nmesaBottomY: ${mesaBottomY}`)
          // set the max y value from mesa[n]y
          const maxY = y; 
          // console.log(`maxY: ${maxY}`);
          // find midpoint between maxY and mesaBottomY
          const horizontalMiddleOfMesa = (maxY + mesaBottomY) / 2;
          // set amplitudeY as diff between max y and mesaBottomY
          const amplitudeY = (maxY - mesaBottomY) / 2; 
          // console.log(`amplitudeY: ${amplitudeY}`);
          // calculate sine as a function of the index
          const sine = Math.sin((index / period1) * TWO_PI) +
              Math.sin((index / period2) * TWO_PI) +
              Math.sin((index / period3) * TWO_PI);
          // console.log(`sine: ${sine}`);
          // set displacementY as sine times amplitudeY
          const displacementY = sine * amplitudeY * amplitudeFactor; 
          // console.log(`displacementY: ${displacementY}`);
          // set y as displacementY plus horizontalMiddleOfMesa
          let finalY = horizontalMiddleOfMesa + displacementY; 
          // console.log(`finalY (unconstrained): ${finalY}`);
          // bound y between amplitudeY and mesaBottomY
          finalY = constrain(finalY, maxY, mesaBottomY); 
          // console.log(`finalY (constrained): ${finalY}`);

          vertex(x, finalY); // add vertex for the modified y value
      });

      // add final point as mesa[last]x, dynamicMidpointY
      vertex(mesa[mesa.length - 1][0], mesaBottomY);

      endShape(CLOSE); // close the shape
  });
}


// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}