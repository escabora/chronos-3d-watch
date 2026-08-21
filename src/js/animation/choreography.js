/**
 * The cinematic score — every scroll beat as data.
 *
 * One unit of `at`/`duration` = one full-viewport section (7 in total).
 * The timeline in ./timeline.js plays these beats onto the animation state;
 * nothing here touches the scene graph directly.
 */
import { prefersReducedMotion } from "@/config/capabilities";

const LINEAR = "none";

export const BEATS = [
  /* -- 01 INTRODUCTION → the watch emerges, camera closes in ------------- */
  { at: 0.0, duration: 1.0, to: { camZ: 8.8, camY: 0.7 } },
  { at: 0.0, duration: 0.9, ease: "power1.out", to: { rootY: 0, rootScale: 1 } },
  { at: 0.0, duration: 1.0, to: { turntable: 0.55 } },
  { at: 0.1, duration: 0.8, to: { keyLight: 1.0 } },
  { at: 0.3, duration: 0.6, to: { spinSpeed: 0 } },

  /* -- 02 THE SILHOUETTE → slow orbit, bezel highlight -------------------- */
  { at: 1.0, duration: 1.0, to: { camX: 3.2, camZ: 7.0, camY: 0.55 } },
  { at: 1.0, duration: 1.0, to: { turntable: 1.35 } },
  { at: 1.25, duration: 0.4, to: { goldLight: 1.1 } },
  { at: 1.65, duration: 0.35, to: { goldLight: 0.35 } },

  /* -- 03 THE CROWN → side close-up, crown slides out ---------------------- */
  { at: 2.0, duration: 1.0, to: { camX: 4.4, camY: 0.5, camZ: 3.6, tgX: 1.5, tgY: 0 } },
  { at: 2.0, duration: 1.0, to: { turntable: 0 } },
  { at: 2.4, duration: 0.45, ease: "power2.inOut", to: { crownOut: 0.4 } },
  { at: 2.3, duration: 0.5, to: { goldLight: 0.95 } },

  /* -- 04 THE DIAL → the surface opens: crystal / bezel / dial lift -------- */
  { at: 3.0, duration: 0.3, ease: "power2.inOut", to: { crownOut: 0 } },
  { at: 3.0, duration: 1.0, to: { camX: 1.6, camY: 3.0, camZ: 5.4, tgX: 0, tgY: 0.6 } },
  { at: 3.05, duration: 1.0, to: { tilt: 1.0 } },
  { at: 3.1, duration: 0.8, ease: "power1.inOut", to: { crystalY: 1.35 } },
  { at: 3.25, duration: 0.8, ease: "power1.inOut", to: { bezelY: 1.0 } },
  { at: 3.4, duration: 0.75, ease: "power1.inOut", to: { dialY: 0.6 } },
  { at: 3.5, duration: 0.7, ease: "power1.inOut", to: { handsY: 0.38 } },

  /* -- 05 THE MOVEMENT → flatten first, then the full vertical explosion --- */
  { at: 4.0, duration: 0.5, to: { tilt: 0.12 } },
  { at: 4.0, duration: 1.0, to: { camX: 0.7, camY: 8.4, camZ: 4.4, tgY: 0.9 } },
  { at: 4.3, duration: 0.65, ease: "power1.inOut", to: { crystalY: 2.75 } },
  { at: 4.35, duration: 0.65, ease: "power1.inOut", to: { bezelY: 2.15 } },
  { at: 4.4, duration: 0.6, ease: "power1.inOut", to: { dialY: 1.55 } },
  { at: 4.45, duration: 0.55, ease: "power1.inOut", to: { handsY: 1.0 } },
  { at: 4.35, duration: 0.65, ease: "power1.inOut", to: { caseY: -0.85, braceletY: -1.45 } },
  { at: 4.4, duration: 0.6, to: { gearSpeed: 1 } },
  { at: 4.2, duration: 0.8, to: { keyLight: 1.0, goldLight: 0.7 } },

  /* -- 06 THE DETAILS → upper layers exit the frame, extreme macro drift --- */
  { at: 5.0, duration: 0.7, ease: "power1.inOut", to: { crystalY: 3.4, bezelY: 2.8, dialY: 2.2, handsY: 1.7 } },
  { at: 5.0, duration: 1.0, to: { camX: 1.7, camY: 1.05, camZ: 1.9, tgX: 0, tgY: 0.1, tgZ: 0 } },
  { at: 5.0, duration: 1.0, to: { turntable: 0.55 } },
  { at: 5.2, duration: 0.7, to: { goldLight: 1.15 } },

  /* -- 07 THE COMPLETE PIECE → staggered reassembly, wide hero shot -------- */
  { at: 6.0, duration: 0.8, ease: "power1.inOut", to: { camX: 0, camY: 0.55, camZ: 10.4, tgX: 0, tgY: 0, tgZ: 0 } },
  { at: 6.05, duration: 0.65, ease: "power1.inOut", to: { tilt: Math.PI / 2 } },
  { at: 6.0, duration: 0.8, to: { turntable: 0.35 } },
  { at: 6.05, duration: 0.4, ease: "power2.inOut", to: { caseY: 0, braceletY: 0 } },
  { at: 6.15, duration: 0.35, ease: "power2.inOut", to: { dialY: 0 } },
  { at: 6.28, duration: 0.35, ease: "power2.inOut", to: { handsY: 0 } },
  { at: 6.42, duration: 0.3, ease: "power2.inOut", to: { crystalY: 0 } },
  { at: 6.52, duration: 0.3, ease: "power2.inOut", to: { bezelY: 0 } },
  { at: 6.2, duration: 0.8, to: { gearSpeed: 0.18 } },
  { at: 6.1, duration: 0.9, to: { goldLight: 0.45, keyLight: 1.0 } },
  { at: 6.6, duration: 0.4, to: { spinSpeed: prefersReducedMotion ? 0 : 0.4 } },
].map((beat) => ({ ease: LINEAR, ...beat }));
