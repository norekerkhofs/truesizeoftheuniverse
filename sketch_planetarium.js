let planets = [];
let centerX = 0;
let centerY = 0;

// responsive at ons
let fontSize;
let showNotice = false;

// speedslider
let speedSlider;
let speedSteps = [1, 1000, 10000, 100000, 500000, 1000000];

// resetButton
let resetButton;

// '3D' perspective
let flatten = 0.5;

// continious movement
let simulatedTime = 0; // in seconds

// checkboxes
let showTrailsCheckbox, showLabelsCheckbox, showOrbitsCheckbox;

function setup() {
  // canvas settings
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  let cnv = select("canvas");
  cnv.style("z-index", "99"); // just above .project-title
  cnv.position(0, 0); // make sure it's properly placed

  fontSize = windowWidth < 600 ? 12 : windowWidth > 1600 ? 16 : 14;

  // speedslider
  speedSlider = createSlider(0, speedSteps.length - 1, 3); // default to index 0 (x1)
  if (windowWidth < 600) {
    speedSlider.position(windowWidth - 100 - 20, height - 90);
    speedSlider.style("width", "100px");
  } else if (windowWidth > 1600) {
    speedSlider.position(windowWidth - 160 - 20, 38);
    speedSlider.style("width", "160px");
  } else {
    speedSlider.position(windowWidth - 120 - 20, 38);
    speedSlider.style("width", "120px");
  }
  speedSlider.style("z-index", "100"); // make sure it's above the canvas

  let orbitScaleFactor;

  if (windowWidth < 600) {
    orbitScaleFactor = 0.275; // smaller radius on small screens
  } else if (windowWidth > 1600) {
    orbitScaleFactor = 1.75; // larger radius on large screens
  } else {
    orbitScaleFactor = 1; // default (medium)
  }

  // planetary information
  planets = [
    {
      label: "Mercury",
      angle: 227.19, // start angle [degrees], measured counterclockwise from the positive X-axis
      orbitRadius: 8.336930639145 * orbitScaleFactor, // [px] scaled to neptune 900px
      orbitDuration: 88.0, // [days]
      trail: [],
      prevAngle: null,
      orbitsCompleted: 0,
      color: "#ff0a00",
      totalAngleTraveled: 0,
    },
    {
      label: "Venus",
      angle: 206.07,
      orbitRadius: 15.578567484534 * orbitScaleFactor,
      orbitDuration: 224.7,
      trail: [],
      prevAngle: null,
      orbitsCompleted: 0,
      color: "#ff0a00",
      totalAngleTraveled: 0,
    },
    {
      label: "Earth",
      angle: 196.83,
      orbitRadius: 21.537034826276 * orbitScaleFactor,
      orbitDuration: 365.2,
      trail: [],
      prevAngle: null,
      orbitsCompleted: 0,
      color: "#ff0a00",
      totalAngleTraveled: 0,
    },
    {
      label: "Mars",
      angle: 151.76,
      orbitRadius: 32.817927451294 * orbitScaleFactor,
      orbitDuration: 687.0,
      trail: [],
      prevAngle: null,
      orbitsCompleted: 0,
      color: "#ff0a00",
      totalAngleTraveled: 0,
    },
    {
      label: "Jupiter",
      angle: 86.33,
      orbitRadius: 112.074555371894 * orbitScaleFactor,
      orbitDuration: 4331,
      trail: [],
      prevAngle: null,
      orbitsCompleted: 0,
      color: "#ff0a00",
      totalAngleTraveled: 0,
    },
    {
      label: "Saturn",
      angle: 352.62,
      orbitRadius: 206.165302274464 * orbitScaleFactor,
      orbitDuration: 10747,
      trail: [],
      prevAngle: null,
      orbitsCompleted: 0,
      color: "#ff0a00",
      totalAngleTraveled: 0,
    },
    {
      label: "Uranus",
      angle: 56.5,
      orbitRadius: 412.756888056199 * orbitScaleFactor,
      orbitDuration: 30589,
      trail: [],
      prevAngle: null,
      orbitsCompleted: 0,
      color: "#ff0a00",
      totalAngleTraveled: 0,
    },
    {
      label: "Neptune",
      angle: 359.37,
      orbitRadius: 650 * orbitScaleFactor,
      orbitDuration: 59800,
      trail: [],
      prevAngle: null,
      orbitsCompleted: 0,
      color: "#ff0a00",
      totalAngleTraveled: 0,
    },
  ];

  // resetbutton
  resetButton = createButton("Reset Time");
  if (windowWidth < 600) {
    resetButton.position((windowWidth - resetButton.width) / 2, 70);
  } else if (windowWidth > 1600) {
    resetButton.position((windowWidth - resetButton.width) / 2, 50);
  } else {
    resetButton.position((windowWidth - resetButton.width) / 2, 50);
  }
  resetButton.mousePressed(() => {
    simulatedTime = 0;
    for (let p of planets) {
      p.trail = []; // clears trails
      p.prevAngle = null;
      p.orbitsCompleted = 0;
      p.totalAngleTraveled = 0;
    }
  });

  resetButton.style("z-index", "100"); // above canvas
  resetButton.class("custom-reset"); // see css

  // Get slider base position
  let sliderX = windowWidth - 140;
  let sliderY = 50;

  let spacing;
  if (windowWidth < 600) {
    spacing = 18;
  } else if (windowWidth > 1600) {
    spacing = 22;
  } else {
    spacing = 22;
  }

  // checkboxes
  let checkboxRightEdge = windowWidth - 20;
  let labelWidth = 140; // approximate width for "Show Trails" + checkbox

  let checkboxX = checkboxRightEdge - labelWidth;

  if (windowWidth < 600) {
    showTrailsCheckbox = createRightAlignedCheckbox(
      "Show Trails",
      true,
      checkboxX,
      height - 157
    );
    showLabelsCheckbox = createRightAlignedCheckbox(
      "Show Labels",
      true,
      checkboxX,
      height - 157 + spacing
    );
    showOrbitsCheckbox = createRightAlignedCheckbox(
      "Show Orbits",
      true,
      checkboxX,
      height - 157 + spacing * 2
    );
  } else if (windowWidth > 1600) {
    showTrailsCheckbox = createRightAlignedCheckbox(
      "Show Trails",
      true,
      checkboxX,
      sliderY + 40
    );
    showLabelsCheckbox = createRightAlignedCheckbox(
      "Show Labels",
      true,
      checkboxX,
      sliderY + 40 + spacing
    );
    showOrbitsCheckbox = createRightAlignedCheckbox(
      "Show Orbits",
      true,
      checkboxX,
      sliderY + 40 + spacing * 2
    );
  } else {
    showTrailsCheckbox = createRightAlignedCheckbox(
      "Show Trails",
      true,
      checkboxX,
      sliderY + 40
    );
    showLabelsCheckbox = createRightAlignedCheckbox(
      "Show Labels",
      true,
      checkboxX,
      sliderY + 40 + spacing
    );
    showOrbitsCheckbox = createRightAlignedCheckbox(
      "Show Orbits",
      true,
      checkboxX,
      sliderY + 40 + spacing * 2
    );
  }
}

function draw() {
  background(0);

  translate(width / 2, height / 2); // recenters everything

  // orbits if checkbox is checked
  if (showOrbitsCheckbox.checked()) {
    drawOrbits();
  }

  // Draw Sun
  noStroke();
  fill(255, 10, 0);
  ellipse(0, 0, 3, 3);

  // Get current speed multiplier from slider
  let speedMultiplier = speedSteps[speedSlider.value()];
  simulatedTime += speedMultiplier; // in seconds per frame

  // Display speed label
  fill(255);
  textSize(fontSize);
  textAlign(RIGHT);
  if (windowWidth < 600) {
    text(`Speed: x${speedMultiplier}`, width / 2 - 20, -height / 2 + 600);
  } else if (windowWidth > 1600) {
    text(`Speed: x${speedMultiplier}`, width / 2 - 20, -height / 2 + 72);
  } else {
    text(`Speed: x${speedMultiplier}`, width / 2 - 20, -height / 2 + 67);
  }

  // Simulated date based on Earth's orbit
  let secondsPerEarthOrbit = 365.2 * 86400;
  let earthYears = simulatedTime / secondsPerEarthOrbit;
  let simYear = Math.floor(earthYears);
  let simDay = Math.floor((earthYears % 1) * 365.2);
  let simMonth = Math.floor(simDay / 30.4);
  simDay = Math.floor(simDay % 30.4);

  // Draw date on screen (centered at top)
  push();
  resetMatrix();
  textSize(fontSize);
  textSize(fontSize);

  textAlign(CENTER, TOP);

  // First part: white label
  fill(255);
  let label = "Simulated Time Passed: ";
  let dateText = `${simYear} Years, ${simMonth
    .toString()
    .padStart(2, "0")} Months, ${simDay.toString().padStart(2, "0")} Days`;
  let fullText = label + dateText;
  let fullWidth = textWidth(fullText);
  let labelWidth = textWidth(label);
  let xStart = width / 2 - fullWidth / 2;

  if (windowWidth < 600) {
    text(label, width / 2, 35);
  } else if (windowWidth > 1600) {
    text(label, xStart + labelWidth / 2, 35);
  } else {
    text(label, xStart + labelWidth / 2, 35);
  }

  // Second part: red values
  fill("red");
  if (windowWidth < 600) {
    text(dateText, width / 2 + 5, 50);
  } else if (windowWidth > 1600) {
    text(dateText, xStart + labelWidth + textWidth(dateText) / 2 + 5, 35);
  } else {
    text(dateText, xStart + labelWidth + textWidth(dateText) / 2 + 5, 35);
  }
  pop();

  // Animate planets
  for (let p of planets) {
    let secondsPerOrbit = p.orbitDuration * 86400;
    let currentAngle =
      (p.angle + (simulatedTime / secondsPerOrbit) * 360) % 360;

    let x = cos(currentAngle) * p.orbitRadius;
    let y = sin(currentAngle) * p.orbitRadius * flatten;

    // Track orbit completion
    if (p.prevAngle !== null) {
      let delta = currentAngle - p.prevAngle;

      // Correct wraparound
      if (delta < -180) delta += 360;
      if (delta > 180) delta -= 360;

      p.totalAngleTraveled += abs(delta);
      p.orbitsCompleted = floor(p.totalAngleTraveled / 360);
    }
    p.prevAngle = currentAngle;

    // Store trail point with timestamp and orbit info
    p.trail.push({
      x,
      y,
      time: simulatedTime,
      orbit: p.orbitsCompleted,
    });

    // Draw trail
    if (showTrailsCheckbox.checked()) {
      noFill();
      beginShape();

      for (let i = 0; i < p.trail.length - 1; i++) {
        let curr = p.trail[i];
        let next = p.trail[i + 1];

        // Switch stroke color based on orbit number
        if (curr.orbit === p.orbitsCompleted) {
          stroke(p.color); // current orbit: red
        } else {
          stroke(255); // older orbit: white
        }

        line(curr.x, curr.y, next.x, next.y);
      }
      endShape();
    }

    // Draw planet
    fill(200);
    noStroke();
    ellipse(x, y, 3, 3);

    textStyle(p.label === "Earth" ? BOLD : NORMAL);
    ellipse(x, y, 3, 3);

    // Draw label
    if (showLabelsCheckbox.checked()) {
      push();
      translate(x + 4, y - 6);
      fill(255);
      textAlign(LEFT);
      rotate(-90);
      text(p.label, 0, 0);
      pop();
    }
  }

  // Show orbit info in columns: orbit count | planet name | duration
  let margin = 20;
  let lineHeight;
  let col1;
  let col2;
  let col3;

  if (windowWidth < 600) {
    lineHeight = 15;
    col1 = -width / 2 + margin;
    col2 = col1 + 35;
    col3 = col2 + 70;
  } else if (windowWidth > 1600) {
    lineHeight = 20;
    col1 = -width / 2 + margin;
    col2 = col1 + 45; // you can tweak spacing here if needed
    col3 = col2 + 120;
  } else {
    lineHeight = 15;
    col1 = -width / 2 + margin;
    col2 = col1 + 40;
    col3 = col2 + 80;
  }

  textAlign(LEFT);
  textSize(fontSize);
  fill(255);
  text(
    "Orbit Counter:",
    col1,
    height / 2 - margin - planets.length * lineHeight - 5
  );

  textAlign(LEFT);
  textSize(fontSize);
  fill(255);
  text(
    "Years per orbit:",
    col3,
    height / 2 - margin - planets.length * lineHeight - 5
  );

  // Reset style for list
  textSize(fontSize);
  textStyle(NORMAL);

  for (let i = 0; i < planets.length; i++) {
    let p = planets[i];
    let y = height / 2 - margin - (planets.length - 1 - i) * lineHeight;

    // Orbit count (in red)
    fill("red");
    text(p.orbitsCompleted, col1, y);

    // Planet name (white)
    fill(255);
    text(p.label, col2, y);

    // Duration info (white)
    let yearsPerOrbit = p.orbitDuration / 365.2;
    let yearsText =
      yearsPerOrbit === 1 ? "1.00" : `${yearsPerOrbit.toFixed(2)}`;
    text(yearsText, col3, y);
  }

  textAlign(RIGHT);
  textSize(fontSize);
  fill(255);

  let noticeText =
    "Important Disclaimer: Planet sizes are not to scale — dots are used for visibility only.";

  push();
  resetMatrix(); // Ensure screen space
  textSize(fontSize);
  fill(255);

  if (windowWidth < 830) {
    if (showNotice) {
      // Box style popup
      let boxWidth = min(300, width - 40);
      let boxHeight = 60;
      let boxX = width - boxWidth - 20;
      let boxY = height - boxHeight - 40;

      noStroke();
      fill(255, 20, 0);
      rect(boxX, boxY, boxWidth, boxHeight, 10);

      fill(255);
      textAlign(LEFT, TOP);
      textWrap(WORD);
      text(noticeText, boxX + 10, boxY + 10, boxWidth - 20);
    }

    // Always show the *
    textAlign(RIGHT, BOTTOM);
    textSize(20);
    fill(255);
    text("*", width - 20, height - 10);
  } else {
    // On large screens, just draw the disclaimer in the bottom right
    textAlign(RIGHT, BOTTOM);
    text(noticeText, width - 20, height - 10);
  }
  pop();

    if (windowWidth < 830) {
    if (showNotice) {
      // speedSlider.hide();
      speedSlider.style("z-index", "1");
    } else {
      speedSlider.style("z-index", "100");
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawOrbits() {
  stroke(100);
  strokeWeight(1);
  noFill();
  for (let p of planets) {
    beginShape();
    for (let a = 0; a < 360; a += 1) {
      // smaller step = smoother circle
      let x = cos(a) * p.orbitRadius;
      let y = sin(a) * p.orbitRadius * flatten;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

function createRightAlignedCheckbox(labelText, defaultChecked, x, y) {
  let label = createDiv(labelText);
  let checkbox = createCheckbox("", defaultChecked);
  checkbox.parent(label);
  label.class("custom-checkbox"); // see css
  label.style("display", "flex");
  label.style("align-items", "center");
  label.style("justify-content", "flex-end");
  label.style("gap", "8px");
  label.style("width", "140px"); // 👈 fixed width for alignment
  label.position(x, y);
  label.style("z-index", "100");
  return checkbox;
}

function mousePressed() {
  // Toggle notice on small screens if user taps *
  if (windowWidth < 830) {
    let d = dist(mouseX, mouseY, width - 20, height - 10);
    if (d < 30) {
      showNotice = !showNotice;
      return;
    }
  }
}
