// === p5.js Orbital Interface Starter === //

let planets = [];
let centerX, centerY;

let sunRadius; // Since ellipse is 50px windowHeight
let sunClicked = false;

let revealAboutPending = false;
// let initialZoom = true;
let initialZoom = false;

let zooming = false;
let zoomTarget = null;
let zoomProgress = 0; // from 0 to 1

const returningFromProject = sessionStorage.getItem("returningFromProject");

if (returningFromProject === "true") {
  // Coming from project: white zoom
  initialZoom = true;
  sessionStorage.removeItem("returningFromProject"); // cleanup
  sunClicked = "initial"; // triggers white zoom-out
} else {
  // Default: red zoom
  initialZoom = true;
  sunClicked = "exit"; // triggers red zoom-out
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style("z-index", "99"); // just above .project-title
  cnv.position(0, 0); // make sure it's properly placed

  centerX = width / 2;
  centerY = height / 2;

  // 🔁 Adjust sun size based on screen width
  if (windowWidth < 600) {
    sunRadius = 15; // small screens (phones)
  } else if (windowWidth < 1600) {
    sunRadius = 25; // medium screens (laptops/tablets)
  } else {
    sunRadius = 35; // large screens (iMacs / big monitors)
  }

  // let orbitScale = windowWidth < 600 ? 0.45 : 1;
  if (windowWidth < 600) {
    orbitScale = 0.45; // small screens (phones)
  } else if (windowWidth < 1600) {
    orbitScale = 1; // medium screens (laptops/tablets)
  } else {
    orbitScale = 1.75; // large screens (iMacs / big monitors)
  }
  // Define the planets with labels, angles, orbit distances and radii
  planets = [
    {
      label: "Scroll",
      angle: 0,
      orbit: 120 * orbitScale,
      radius: 10,
      speed: 0.3,
      targetSpeed: 0.2,
      url: "scroll.html",
    },
    {
      label: "AR Walk",
      angle: 90,
      orbit: 180 * orbitScale,
      radius: 15,
      speed: 0.2,
      targetSpeed: 0.2,
      url: "walk.html",
    },
    {
      label: "Planetarium",
      angle: 180,
      orbit: 230 * orbitScale,
      radius: 12,
      speed: 0.5,
      targetSpeed: 0.2,
      url: "planetarium.html",
    },
    {
      label: "Open-source",
      angle: 270,
      orbit: 360 * orbitScale,
      radius: 8,
      speed: 0.3,
      targetSpeed: 0.2,
      url: "https://github.com/norekerkhofs/truesizeoftheuniverse",
    },
    {
      label: "Contact",
      angle: 0,
      orbit: 600 * orbitScale,
      radius: 14,
      speed: 0.3,
      targetSpeed: 0.2,
      url: "contact.html",
    },
  ];

  // zooming = true;
  // zoomProgress = 0;
  // zoomTarget = { x: centerX, y: centerY - 30, radius: width * 2 };
  // sunClicked = "initial"; // custom zoom-out state

  if (initialZoom) {
    zooming = true;
    zoomProgress = 0;
    zoomTarget = { x: centerX, y: centerY - 30, radius: width * 2 };
  }
}

function draw() {
  background(0);
  noStroke();

  // Check for hover
  let d = dist(mouseX, mouseY, centerX, centerY - 30);
  if (d < sunRadius) {
    cursor(HAND); // Change cursor
    // Glow effect like the planets
    stroke(255, 10, 0, 70);
    fill(255, 10, 0, 50);
    ellipse(centerX, centerY - 30, sunRadius * 3); // glow circle
  } else {
    cursor(ARROW);
  }

  // Draw sun itself
  noStroke();
  fill(255, 20, 0);
  ellipse(centerX, centerY - 30, sunRadius * 2);

  // Draw and animate each planet
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(12);

  for (let planet of planets) {
    let angleRad = radians(planet.angle);
    let x = centerX + cos(angleRad) * planet.orbit;
    let y = centerY + sin(angleRad) * planet.orbit - 30;

    planet.x = x;
    planet.y = y;

    // Orbit path
    noFill();
    stroke(80);
    ellipse(centerX, centerY - 30, planet.orbit * 2);

    // Hover detection
    let hovering = dist(mouseX, mouseY, x, y) < planet.radius * 1.5;

    // Adjust target speed
    planet.targetSpeed = hovering ? 0 : 0.2;

    // Smoothly lerp speed toward target
    planet.speed = lerp(planet.speed, planet.targetSpeed, 0.05);

    // Draw glow and scale
    if (hovering) {
      fill(255, 255, 255, 50);
      ellipse(x, y, planet.radius * 3);
    }

    noStroke();
    fill(hovering ? 255 : 200);
    ellipse(x, y, hovering ? planet.radius * 1.2 : planet.radius);

    // Label
    fill(255);
    text(planet.label, x, y - planet.radius - 15);

    // Update angle based on speed
    planet.angle += planet.speed;
  }

  if (zooming && zoomTarget) {
    zoomProgress += 0.02;
    let eased = easeInOutQuad(zoomProgress);

    // ⚪ White intro zoom-out (first load)
    if (sunClicked === "initial") {
      let reverseEased = 1 - eased;
      fill(255 * reverseEased); // white to transparent
      rect(0, 0, width, height);
      let zoomSize = lerp(width * 2, sunRadius, eased);
      fill(255);
      ellipse(centerX, centerY - 30, zoomSize);

      if (zoomProgress >= 1) {
        sunClicked = false;
        zooming = false;
        initialZoom = false;
      }
      return;
    }

    // 🔴 Red zoom-out from About section
    if (sunClicked === "exit") {
      let reverseEased = 1 - eased;
      fill(255 * reverseEased, 20 * reverseEased, 0);
      rect(0, 0, width, height);
      let zoomSize = lerp(width * 2, sunRadius, eased);
      fill(255, 20, 0);
      ellipse(centerX, centerY - 30, zoomSize);

      if (zoomProgress >= 1) {
        sunClicked = false;
        zooming = false;
      }
      return;
    }

    // 🪐 Planet or red sun zoom-in
    // Background (white for planets, red for sun)
    if (!sunClicked) {
      fill(255, 255, 255, eased * 255); // white background for planets
    } else {
      fill(255, 20, 0, eased * 255); // red background for sun zoom-in
    }

    noStroke();
    rect(0, 0, width, height);

    // Zoomed circle
    let zoomSize = lerp(zoomTarget.radius, width * 2, eased);
    if (sunClicked) {
      fill(255, 20, 0); // red sun
    } else {
      fill(255); // white for planet
    }
    ellipse(zoomTarget.x, zoomTarget.y, zoomSize);

    // Final transition
    if (zoomProgress >= 1 && zooming) {
      zooming = false; // Prevent multiple triggers

      if (sunClicked === true) {
        revealAboutPending = true;
      } else if (zoomTarget && zoomTarget.url) {
        if (zoomTarget.url.startsWith("http")) {
          // External link like GitHub — open in new tab safely
          window.open(zoomTarget.url, "_blank");
        } else {
          // Internal page
          window.location.href = zoomTarget.url;
        }
      } else {
        console.log("Transition complete: now show project content.");
      }
    }
  }

  if (revealAboutPending) {
    document.getElementById("about-section").classList.remove("hidden");
    zooming = false;
    revealAboutPending = false;
  }
}

function mousePressed() {
  // Check planet clicks
  for (let planet of planets) {
    let d = dist(mouseX, mouseY, planet.x, planet.y);
    if (d < planet.radius * 1.5) {
      // External link: open immediately
      if (planet.url.startsWith("http")) {
        window.open(planet.url, "_blank");
        return; // Don't continue zoom
      }

      // Internal links: use zoom transition
      zooming = true;
      zoomTarget = planet;
      zoomProgress = 0;
      sunClicked = false;
      return;
    }
  }

  // Check sun click
  let d = dist(mouseX, mouseY, centerX, centerY - 30);
  if (d < sunRadius) {
    zooming = true;
    zoomTarget = { x: centerX, y: centerY - 30, radius: sunRadius };
    zoomProgress = 0;
    sunClicked = true;
    document.getElementById("canvas-title").classList.add("fade-out");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function exitAbout() {
  // Hide About section
  document.getElementById("about-section").classList.add("hidden");

  const title = document.getElementById("canvas-title");
  title.classList.remove("fade-out");

  // Trigger zoom-out from sun
  zooming = true;
  zoomProgress = 0;
  zoomTarget = { x: centerX, y: centerY - 30, radius: width * 2 }; // Start big, shrink
  sunClicked = "exit";
}
