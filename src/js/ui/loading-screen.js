/**
 * Loading experience — brand reveal, counter, bar, then curtain up.
 */
import gsap from "gsap";
import anime from "animejs/lib/anime.es.js";
import { animateHeadline } from "./headline";

const DURATION = 1900;

export function playLoadingSequence() {
  const loader = document.getElementById("loader");
  const percentEl = document.getElementById("loaderPercent");
  const counter = { value: 0 };

  anime
    .timeline({ easing: "easeOutQuad" })
    .add({
      targets: ".loader-logo",
      opacity: [0, 1],
      letterSpacing: ["0.9em", "0.55em"],
      duration: 1100,
      easing: "easeOutExpo",
    })
    .add({ targets: ".loader-sub", opacity: [0, 0.7], duration: 600 }, "-=600");

  anime({
    targets: counter,
    value: 100,
    duration: DURATION,
    easing: "easeInOutQuart",
    update: () => {
      percentEl.textContent = `${Math.round(counter.value)}%`;
    },
  });

  anime({
    targets: "#loaderBarFill",
    scaleX: [0, 1],
    duration: DURATION,
    easing: "easeInOutQuart",
    complete: () => revealStage(loader),
  });
}

function revealStage(loader) {
  gsap
    .timeline()
    .to(loader, { opacity: 0, duration: 0.9, ease: "power2.inOut" })
    .set(loader, { display: "none" })
    .to("#webgl", { opacity: 1, duration: 1.4, ease: "power2.out" }, "-=0.7")
    .add(() => {
      animateHeadline(document.querySelector(".s1"), true);
      gsap.to(".s1 .kicker, .s1 .sub", {
        opacity: 1,
        duration: 1.2,
        delay: 0.35,
        ease: "power2.out",
      });
    }, "-=0.9");
}
