import * as THREE from "three";
import { ctx } from "@/core/context";
import { animationState } from "@/core/state";
import { CAMERA } from "@/config/settings";

export function createCamera() {
  ctx.camera = new THREE.PerspectiveCamera(
    CAMERA.FOV_DESKTOP,
    window.innerWidth / window.innerHeight,
    CAMERA.NEAR,
    CAMERA.FAR
  );
  ctx.camera.position.set(animationState.camX, animationState.camY, animationState.camZ);
}
