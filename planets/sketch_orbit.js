document.addEventListener("DOMContentLoaded", () => {
  const orbitEl = document.querySelector(".inclination .orbit");
  if (!orbitEl) return;

  let rotation = 0;
  let hovering = false;
  let animationFrame;
  let finishingRotation = false;

  function spin() {
    if (hovering) {
      rotation += 4;
      orbitEl.style.transform = `rotate(${rotation}deg)`;
      animationFrame = requestAnimationFrame(spin);
    }
  }

  orbitEl.addEventListener("mouseenter", () => {
    hovering = true;
    finishingRotation = false;
    orbitEl.style.transition = "none";
    animationFrame = requestAnimationFrame(spin);
  });

  orbitEl.addEventListener("mouseleave", () => {
    hovering = false;
    cancelAnimationFrame(animationFrame);

    const number = parseFloat(orbitEl.innerText);
    if (isNaN(number)) return;

    // Calculate the smallest target angle > current rotation
    // that ends in `360 * full turns + number`
    const currentRotation = rotation;
    const base = Math.ceil((currentRotation - number) / 360);
    const targetRotation = 360 * (base + 1) + number - 90;

    orbitEl.style.transition = "transform 0.8s ease-out";
    orbitEl.style.transform = `rotate(${targetRotation}deg)`;
    rotation = targetRotation; // update stored rotation

    // Optional: clean up after transition if you want to reset
    orbitEl.addEventListener("transitionend", function handler() {
      orbitEl.removeEventListener("transitionend", handler);
    });
  });

  orbitEl.addEventListener("touchstart", () => {
    hovering = true;
    orbitEl.style.transition = "none";
    animationFrame = requestAnimationFrame(spin);
  });

  orbitEl.addEventListener("touchend", () => {
    hovering = false;
    cancelAnimationFrame(animationFrame);
    orbitEl.dispatchEvent(new Event("mouseleave")); // trigger rotation alignment
  });
});
