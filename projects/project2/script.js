let table;
let day = 0;

// Arrays
let elements = ["Rain", "Sunshine", "Wind", "Cloudiness", "Temperature"];
let maxValues = [100, 12, 50, 100, 35];
let units = ["%", "h", "km/h", "%", "°C"];
let colors = ["#00BFFF", "#FFE600", "#00FFD1", "#D4D8DE", "#FF541F"];

let animatedValues = [0, 0, 0, 0, 0];

let dia = 36;
let spacing = 38;
let navSpacing = 42;

let baseRadius = 105;
let ringSpacing = 48;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  table = await loadTable("weather_random.csv", ",", "header");
}

function draw() {
  background(5);

  if (!table) return;

  let centerX = width / 2;
  let centerY = height / 2 - 50;

  let navY = centerY + 350;
  let tipY = navY + 50;

  cursor(ARROW);

  // Navigation: switch days by hovering
  for (let i = 0; i < 7; i++) {

    let x = centerX + (i - 3) * navSpacing;

    if (dist(mouseX, mouseY, x, navY) < 16) {
      day = i;
      cursor(HAND);
    }

    if (i === day) {
      fill(255);
      circle(x, navY, 20);
    } else {
      fill(90);
      circle(x, navY, 12);
    }
  }

  // Weather circles
  push();
  translate(centerX, centerY);

  for (let i = 0; i < elements.length; i++) {

    let value = table.getNum(day, elements[i]);
    let radius = baseRadius + i * ringSpacing;

    // Convert weather value into number of dots
    let maxDots = floor(TWO_PI * radius / spacing);
    let targetDots = floor(map(value, 0, maxValues[i], 0, maxDots) + 0.5);

    // Animation: increase or decrease the number of dots
    if (animatedValues[i] < targetDots) {
      animatedValues[i] += 0.2;

      if (animatedValues[i] > targetDots) {
        animatedValues[i] = targetDots;
      }

    } else if (animatedValues[i] > targetDots) {
      animatedValues[i] -= 0.2;

      if (animatedValues[i] < targetDots) {
        animatedValues[i] = targetDots;
      }
    }

    // Draw circles
    fill(colors[i]);

    for (let j = 0; j < animatedValues[i]; j++) {

      let angle = j * TWO_PI / maxDots + PI;

      let x = cos(angle) * radius;
      let y = sin(angle) * radius;

      // Growing and shrinking effect
      let size = (animatedValues[i] - j) * dia;
      size = constrain(size, 0, dia);

      circle(x, y, size);
    }
  }

  // Text in the center
  textAlign(CENTER, CENTER);

  fill(255);
  textSize(34);
  text(table.getString(day, "Day"), 0, -16);

  fill(170);
  textSize(15);
  text("Weather overview", 0, 16);

  pop();

  // Legend
  textAlign(LEFT, CENTER);
  textSize(14);

  for (let i = 0; i < elements.length; i++) {

    let value = table.getNum(day, elements[i]);
    let y = 40 + i * 30;

    fill(colors[i]);
    circle(30, y, 10);

    fill(255);
    text(elements[i] + ": " + value + " " + units[i], 50, y);
  }

  // Daily recommendation
  weatherTip(centerX, tipY);
}

// Function for daily weather tips
function weatherTip(x, y) {

  let rain = table.getNum(day, "Rain");
  let sunshine = table.getNum(day, "Sunshine");
  let wind = table.getNum(day, "Wind");
  let clouds = table.getNum(day, "Cloudiness");
  let temperature = table.getNum(day, "Temperature");

  let tip;

  if (rain >= 80 && wind >= 30) {
    tip = "Bring a waterproof jacket.";
    fill(colors[0]);

  } else if (rain >= 50) {
    tip = "Take an umbrella with you.";
    fill(colors[0]);

  } else if (temperature >= 25) {
    tip = "Wear light clothing and stay hydrated.";
    fill(colors[4]);

  } else if (sunshine >= 7) {
    tip = "Don't forget your sunglasses.";
    fill(colors[1]);

  } else if (wind >= 25) {
    tip = "Bring a windproof jacket.";
    fill(colors[2]);

  } else if (temperature <= 15) {
    tip = "Dress warmly today.";
    fill(colors[4]);

  } else if (clouds >= 60) {
    tip = "Bring an extra layer.";
    fill(colors[3]);

  } else {
    tip = "A lovely day for a walk.";
    fill(255);
  }

  textAlign(CENTER, CENTER);
  textSize(16);
  text(tip, x, y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}