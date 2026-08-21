/**
 * Scroll controller — ONE master timeline, scrubbed by the page scroll.
 * It plays the declarative score from ./choreography.js onto the shared
 * animation state; apply-state.js pushes that state onto the scene.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animationState } from "@/core/state";
import { BEATS } from "./choreography";

gsap.registerPlugin(ScrollTrigger);

export function createScrollTimeline() {
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: ".experience",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    },
  });

  BEATS.forEach(({ at, duration, ease, to }) => {
    timeline.to(animationState, { ...to, duration, ease }, at);
  });

  return timeline;
}
