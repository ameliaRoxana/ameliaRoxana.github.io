let buffer;
let brightness2D = []; // brightness2D[x][y] is how bright the word is at one pixel of the buffer

async function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(0);
    stroke(255);
    strokeWeight(2);
    ellipse(width/2, height/2, 100, 100)
}