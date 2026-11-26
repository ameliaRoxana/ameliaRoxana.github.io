let font;
let fontPath = "madimi.ttf";
let fontSize = 300;
let letter = "LIGHTS";


//contains the positions of the points outlining the letters
//xPos and yPos used for the coordinates of the moving points
let points = [];
let xPos = [];
let yPos = [];

async function setup() {
  createCanvas(windowWidth, windowHeight + 100);
  noStroke();

  font = await loadFont(fontPath);
  textSize(fontSize);
  textAlign(CENTER, CENTER);
 

//textToPoints from 13 Images & Typography
 //sampleFactor controls the density of the points, lower = more points
  points = font.textToPoints(letter, 0, 0, {
    sampleFactor: 0.05
  });

// for loop to create random x and y positions for the points to move around
  for (let i = 0; i < points.length; i++) {
    xPos.push(random(-1, 1));
    yPos.push(random(-1, 1));
  }
}

function draw() {
  background(0,40);

 // Mouse distance from center aka the effect for the growing smiley
  let distance = dist(mouseX, mouseY, width / 2, height / 2);

  // range of how far the circles can spread
  let spread = map(distance, 125, width / 2, 0, 1500);
  spread = constrain(spread, 3, 1500);

  // size of the circles, get bigger the further away the mouse is from the center
  let dia = map(distance, 120, width / 2, 5, 200);
  dia = constrain(dia, 5, 200);

  // opacity with alphaVal creates a more vibrant effect instead of creating opacity with the color values
  let alphaVal = map(distance, 150, width / 2, 255, 130);
  alphaVal = constrain(alphaVal, 130, 255);

  // Adjust position of the word, because CENTER,CENTER places it in the upper left corner of the canvas
  translate(width / 2 + 100, height / 2);
  
  // Go through every point of the letters to draw and animate each circle
  for (let i = 0; i < points.length; i++) {

    // Creates a chain movement by shifting through the point positions every 5 frames
    let index = (i + floor(frameCount / 5)) % points.length;

    // Get the coordinates of the points
    let px = points[index].x;
    let py = points[index].y;

    // This is where random movement of the circles is applied, otherwise they would just be in a static position on the line of the letter
let x = px + xPos[i] * spread + random(-5, 5);
let y = py + yPos[i] * spread + random(-5, 5);

// Alternate between warm colors and cyan
// Array to store two alternating values
let colors = [
  color(random(200, 255), random(60, 230), random(0, 100)),
  color(random(0, 50), random(180, 255), random(180, 255))
];

//set.Alpha (alphaVal) creats opacity, without it the colors are very strong
if (i % 2 == 0) {
  colors[0].setAlpha(alphaVal);
  fill(colors[0]);
  circle(x, y, dia);
} else {
  colors[1].setAlpha(alphaVal);
  fill(colors[1]);
  circle(x, y, dia);
}

  }
}