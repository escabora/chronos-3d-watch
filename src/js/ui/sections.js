/**
 * Section text — headline reveals, kickers, technical labels, HUD counter.
 * All secondary motion is scrubbed so it stays glued to the scroll.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitHeadlinesIntoChars, animateHeadline } from "./headline";

gsap.registerPlugin(ScrollTrigger);

export function setupSectionAnimations() {
  splitHeadlinesIntoChars();

  const hudCurrent = document.getElementById("hudCurrent");

  document.querySelectorAll(".section").forEach((section) => {
    setupHeadlineTrigger(section, hudCurrent);
    setupSecondaryText(section);
    setupTechLabels(section);
  });

  // first section is in view on load — revealed after the loading screen
  gsap.set(".s1 .kicker, .s1 .sub", { opacity: 0 });

  setupScrollHint();
  setupStageGlow();
}

function setupHeadlineTrigger(section, hudCurrent) {
  ScrollTrigger.create({
    trigger: section,
    start: "top 62%",
    end: "bottom 38%",
    onEnter: () => animateHeadline(section, true),
    onEnterBack: () => animateHeadline(section, true),
    onLeave: () => animateHeadline(section, false),
    onLeaveBack: () => animateHeadline(section, false),
    onToggle: (self) => {
      if (self.isActive) hudCurrent.textContent = section.dataset.index;
    },
  });
}

function setupSecondaryText(section) {
  const secondary = section.querySelectorAll(".kicker, .sub, .cta");
  if (!secondary.length) return;

  gsap.fromTo(
    secondary,
    { opacity: 0, y: 34 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.12,
      ease: "none",
      scrollTrigger: { trigger: section, start: "top 58%", end: "top 22%", scrub: true },
    }
  );
}

function setupTechLabels(section) {
  const labels = section.querySelectorAll(".tech-label");
  if (!labels.length) return;

  const timeline = gsap.timeline({
    scrollTrigger: { trigger: section, start: "top 55%", end: "top 10%", scrub: true },
  });

  timeline.fromTo(
    labels,
    { opacity: 0, x: (_, el) => (el.closest(".labels-right") ? 40 : -40) },
    { opacity: 1, x: 0, stagger: 0.2, ease: "none" }
  );
  timeline.fromTo(
    section.querySelectorAll(".tl-line"),
    { scaleX: 0 },
    { scaleX: 1, stagger: 0.2, ease: "none" },
    0
  );
}

function setupScrollHint() {
  gsap.to("#scrollHint", {
    opacity: 0,
    scrollTrigger: { trigger: ".experience", start: "top top", end: "4% top", scrub: true },
  });
}

function setupStageGlow() {
  gsap.fromTo(
    ".stage-glow",
    { opacity: 0.7 },
    {
      opacity: 1.6,
      scrollTrigger: { trigger: ".s5", start: "top bottom", end: "bottom top", scrub: true },
    }
  );
}
