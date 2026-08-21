/**
 * Application orchestrator — wires every layer together in bootstrap order.
 */
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ctx } from "./context";
import { animationState, parts } from "./state";
import { createScene } from "@/scene/scene";
import { createCamera } from "@/scene/camera";
import { createRenderer } from "@/scene/renderer";
import { createLights } from "@/scene/lights";
import { createEnvironment } from "@/scene/environment";
import { handleResize } from "@/scene/viewport";
import { createWatchMaterials } from "@/watch/materials";
import { loadWatch } from "@/watch/loader";
import { createScrollTimeline } from "@/animation/timeline";
import { startRenderLoop } from "@/animation/loop";
import { setupSectionAnimations } from "@/ui/sections";
import { setupCursor } from "@/ui/cursor";
import { playLoadingSequence } from "@/ui/loading-screen";

export async function startApp() {
  ctx.clock = new THREE.Clock();

  createScene();
  createCamera();
  createRenderer();
  createLights();
  createEnvironment();
  createWatchMaterials();
  await loadWatch();

  createScrollTimeline();
  setupSectionAnimations();
  setupCursor();

  handleResize();
  window.addEventListener("resize", () => {
    handleResize();
    ScrollTrigger.refresh();
  });

  ctx.ready = true;
  startRenderLoop();
  playLoadingSequence();

  // debug / integration handle (handy for QA and for GLB fitting)
  window.CHRONOS = { ctx, parts, animationState };
}
