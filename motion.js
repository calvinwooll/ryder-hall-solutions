// Interactive extras that need a little JavaScript:
//   1. a soft light that follows the mouse across the dark banners
//   2. cards that tilt toward the mouse
// Skipped on touchscreens and for anyone whose device asks for less motion.
// The site works the same without this file.

(() => {
  const lessMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (lessMotion || !hasMouse) return;

  // 1. Light that follows the mouse across the dark banners
  for (const banner of document.querySelectorAll(".hero, .page-hero")) {
    banner.addEventListener("pointermove", (event) => {
      const box = banner.getBoundingClientRect();
      banner.style.setProperty("--mx", `${event.clientX - box.left}px`);
      banner.style.setProperty("--my", `${event.clientY - box.top}px`);
    });
  }

  // 2. Cards tilt toward the mouse. data-tilt="3" sets the strongest tilt in degrees (default 7).
  for (const card of document.querySelectorAll("[data-tilt]")) {
    const strength = Number(card.dataset.tilt) || 7;
    card.addEventListener("pointermove", (event) => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.style.setProperty("--rx", `${(-y * strength * 2).toFixed(2)}deg`);
      card.style.setProperty("--ry", `${(x * strength * 2).toFixed(2)}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--rx");
      card.style.removeProperty("--ry");
    });
  }
})();
