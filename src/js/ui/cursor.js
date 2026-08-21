/**
 * Microinteractions — custom cursor, magnetic CTA, pointer parallax.
 * Skipped entirely on touch devices.
 */
import gsap from "gsap";
import { mouse } from "@/core/state";
import { isTouch } from "@/config/capabilities";

const RING_LERP = 0.14;
const MAGNET_STRENGTH = 22;

export function setupCursor() {
  if (isTouch) return;

  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  const ringPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const target = { ...ringPosition };

  window.addEventListener("pointermove", (event) => {
    document.body.classList.add("has-pointer");
    target.x = event.clientX;
    target.y = event.clientY;
    dot.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;

    // normalized pointer position drives the camera parallax
    mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = -(event.clientY / window.innerHeight - 0.5) * 2;
  });

  gsap.ticker.add(() => {
    ringPosition.x += (target.x - ringPosition.x) * RING_LERP;
    ringPosition.y += (target.y - ringPosition.y) * RING_LERP;
    ring.style.transform = `translate(${ringPosition.x}px, ${ringPosition.y}px) translate(-50%, -50%)`;
  });

  document.querySelectorAll("[data-hover], .cta").forEach((el) => {
    el.addEventListener("pointerenter", () => ring.classList.add("is-hover"));
    el.addEventListener("pointerleave", () => ring.classList.remove("is-hover"));
  });

  setupMagneticButtons();

  document.getElementById("cta")?.addEventListener("click", (e) => e.preventDefault());
}

function setupMagneticButtons() {
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * MAGNET_STRENGTH;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * MAGNET_STRENGTH;
      gsap.to(el, { x, y, duration: 0.5, ease: "power3.out" });
    });
    el.addEventListener("pointerleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
    });
  });
}
