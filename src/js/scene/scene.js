import * as THREE from "three";
import { ctx } from "@/core/context";
import { COLORS } from "@/config/settings";

export function createScene() {
  ctx.scene = new THREE.Scene();
  ctx.scene.background = new THREE.Color(COLORS.BACKGROUND);
  ctx.scene.fog = new THREE.Fog(COLORS.BACKGROUND, 18, 30);
}
