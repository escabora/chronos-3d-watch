import * as THREE from "three";
import { ctx } from "@/core/context";
import { RENDERING } from "@/config/settings";
import { isLowPerf, getMaxPixelRatio } from "@/config/capabilities";

export function createRenderer() {
  ctx.renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("webgl"),
    antialias: !isLowPerf,
    powerPreference: "high-performance",
  });

  ctx.renderer.setSize(window.innerWidth, window.innerHeight);
  ctx.renderer.setPixelRatio(getMaxPixelRatio());
  ctx.renderer.outputColorSpace = THREE.SRGBColorSpace;
  ctx.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  ctx.renderer.toneMappingExposure = RENDERING.EXPOSURE;

  if (!isLowPerf) {
    ctx.renderer.shadowMap.enabled = true;
    ctx.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
}
