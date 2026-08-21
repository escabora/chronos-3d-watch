/**
 * Headline choreography — characters slide out of an overflow mask.
 * One animate function handles both directions; no duplicated tweens.
 */
import anime from "animejs/lib/anime.es.js";

const HIDDEN_Y = "105%";

export function splitHeadlinesIntoChars() {
  document.querySelectorAll(".headline .line").forEach((line) => {
    const text = line.textContent;
    line.textContent = "";
    [...text].forEach((char) => {
      const span = document.createElement("span");
      span.className = "char";
      span.innerHTML = char === " " ? "&nbsp;" : char;
      line.appendChild(span);
    });
  });

  // start hidden — via anime so its transform cache owns the chars
  anime.set(".headline .char", { translateY: HIDDEN_Y, opacity: 0 });
}

export function animateHeadline(section, visible) {
  const chars = section.querySelectorAll(".headline .char");
  anime.remove(chars);
  anime({
    targets: chars,
    translateY: visible ? [HIDDEN_Y, "0%"] : HIDDEN_Y,
    opacity: visible ? [0, 1] : 0,
    easing: visible ? "easeOutExpo" : "easeInExpo",
    duration: visible ? 1100 : 450,
    delay: anime.stagger(visible ? 26 : 10),
  });
}
