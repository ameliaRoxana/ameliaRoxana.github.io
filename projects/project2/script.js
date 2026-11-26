let table;
let day = 0;
let font;

// arrays for CSV file
//elements.length = 5
let elements = ["Rain", "Sunshine", "Wind", "Cloudiness", "Temperature"];
let maxValues = [100, 12, 50, 100, 35];
let units = ["%", "h", "km/h", "%", "°C"];
let colors = ["#00BFFF", "#FFE600", "#00FFD1", "#D4D8DE", "#FF541F"];
// animation used to fill circles gradually instead of all at once
let animatedValues = [0, 0, 0, 0, 0];

//Circles size and spacing
let dia = 36;
let spacing = 40;

// Rings spacing and gaps 
let baseRadius = 128;
let ringSpacing = 42;
let sideGap = 110;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  table = await loadTable("weather_random.csv", ",", "header");

  font = await loadFont("Suisse.ttf");
  textFont(font);
}

function draw() {
  background(0);
// Center of the canvas
// outerRadius is the distance from center to outermost ring
  let centerX = width / 2;
  let centerY = height / 2;
  let outerRadius = baseRadius + 4 * ringSpacing;

  // Layout of the navigation bar, legend and weather tip
  let navY = centerY + outerRadius + 45;
  let legendX = centerX + outerRadius + sideGap;
  let tipLeftX = centerX - outerRadius - sideGap - 170; //170 is the additional width for the message (tip)

  // loop for navigation bar, 7 days in a week and each circle represents a day
for (let i = 0; i < 7; i++) {
  let x = centerX + (i - 3) * 42; //42 is the spacing between the navigation bar circles
  let isHovered = dist(mouseX, mouseY, x, navY) < 16;

 if (isHovered) {
    day = i;
  }
  if (i === day) { //keeps the circle large and white even if mouse is not hovering over it
    fill(255);
    circle(x, navY, 20);
  } else {
    fill(90);
    circle(x, navY, 12);
  }
}

  // Weather circles
  //push and pop to keep the translate() function from affecting elements outside the weather circles
  push();
  // translate moves the origin of the canvas to the center of the weater circles
  translate(centerX, centerY);

  for (let i = 0; i < elements.length; i++) { //elements.length = 5, so this loop will run 5 times, once for each weather element
    let value = table.getNum(day, elements[i]);
    let radius = baseRadius + i * ringSpacing;

    // Convert weather values into dots
    //Calculate how many dots could fit around the entire ring
    /*TWO_PI * radius calculates the circumference. 
    / spacing divides that circumference into sections of approximately 40 pixels.
    floor() rounds down to a whole number.*/
    let maxDots = floor(TWO_PI * radius / spacing);
    //Calculates how many dots are actually displayed
    let targetDots = floor(map(value, 0, maxValues[i], 0, maxDots) + 0.5);

    // Animation
    //growing effect, instead of all dots appearing at once, they appear in a 0.2 increment, the same goes for shrinking
    //constrain/( prevent the animation from going beyong the targetDots and maxDots
    if (animatedValues[i] < targetDots) {
      animatedValues[i] += 0.2;
      animatedValues[i] = constrain(animatedValues[i], 0, targetDots);
    } else {
      animatedValues[i] -= 0.2;
      animatedValues[i] = constrain(animatedValues[i], targetDots, maxDots);
    }

    // Draw weather dots
    // second part of nested for loop, i determines which ring/element is being drawn, j determines how many dots
    fill(colors[i]);
    for (let j = 0; j < animatedValues[i]; j++) {
      let angle = j * TWO_PI / maxDots + PI;
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      let size = constrain((animatedValues[i] - j) * dia, 0, dia);
      circle(x, y, size);
    }
  }

  // Day and weather label
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(30);
  text(table.getString(day, "Day"), 0, -15);
  fill(170);
  textSize(20);
  text("Weather", 0, 20);
  pop();

  // Legend
  textAlign(LEFT, CENTER);
  textSize(20);
  for (let i = 0; i < elements.length; i++) {
    let value = table.getNum(day, elements[i]);
    let y = centerY + (i - 2) * 44;
    fill(colors[i]);
    circle(legendX, y, 18);
    fill(255);
    text(elements[i] + ": " + value + " " + units[i], legendX + 28, y);
  }

  weatherTip(tipLeftX, centerY);
}

// Weather tip
function weatherTip(x, y) {
  let rain = table.getNum(day, "Rain");
  let sunshine = table.getNum(day, "Sunshine");
  let wind = table.getNum(day, "Wind");
  let clouds = table.getNum(day, "Cloudiness");
  let temperature = table.getNum(day, "Temperature");
  let tip;
  let tipColor;

  //message displayed baser on weather conditions
  if (rain >= 80 && wind >= 30) {
    tip = "Wear a waterproof jacket.";
    tipColor = colors[0];
  } else if (rain >= 50) {
    tip = "Take an umbrella with you.";
    tipColor = colors[0];
  } else if (temperature >= 25) {
    tip = "Avoid the sun and stay hydrated.";
    tipColor = colors[4];
  } else if (sunshine >= 7) {
    tip = "Put on your sunglasses.";
    tipColor = colors[1];
  } else if (wind >= 25) {
    tip = "Wear a windproof jacket.";
    tipColor = colors[2];
  } else if (temperature <= 15) {
    tip = "Dress warmly today.";
    tipColor = colors[4];
  } else if (clouds >= 60) {
    tip = "A nice day to stay indoors.";
    tipColor = colors[3];
  } else {
    tip = "A nice day for a walk.";
    tipColor = "#FFFFFF";
  }
  // Draw weather tip
  fill(tipColor);
  circle(x + 7, y - 35, 14);
  fill(170);
  textAlign(LEFT, CENTER);
  textSize(13);
  text("Daily tip", x + 22, y - 35);
  fill(255);
  textAlign(LEFT, TOP);
  textSize(22);
  textLeading(28);
  text(tip, x, y - 10, 170, 150);
}

//just to be on the safe side
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}