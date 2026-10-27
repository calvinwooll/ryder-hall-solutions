// Interactive extras that need a little JavaScript:
//   1. a soft light that follows the mouse across the dark banners
//   2. cards that tilt toward the mouse
//   3. two circles that trail the mouse (a nod to the logo)
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

  // 3. Two circles that follow the mouse: the dot keeps up, the ring trails behind
  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "cursor-dot";
  ring.className = "cursor-ring";
  document.body.append(dot, ring);

  let x = -100;
  let y = -100;
  let ringX = x;
  let ringY = y;
  let frame = 0;

  // Runs only while the ring is still catching up, so nothing runs when the mouse is still
  const follow = () => {
    ringX += (x - ringX) * 0.18;
    ringY += (y - ringY) * 0.18;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    frame = Math.abs(x - ringX) + Math.abs(y - ringY) > 0.5 ? requestAnimationFrame(follow) : 0;
  };

  window.addEventListener("pointermove", (event) => {
    x = event.clientX;
    y = event.clientY;
    document.body.classList.add("has-cursor");
    ring.classList.toggle("is-active", Boolean(event.target.closest("a, button")));
    if (!frame) frame = requestAnimationFrame(follow);
  });

  document.addEventListener("mouseout", (event) => {
    if (!event.relatedTarget) document.body.classList.remove("has-cursor");
  });
})();
