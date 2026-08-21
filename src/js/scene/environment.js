/**
 * Procedural HDRI substitute: an emissive "photo studio" (softboxes, strips,
 * a gold kicker) rendered to a PMREM environment map.
 * Swap for a real .hdr via RGBELoader if you have one — see README.
 */
import * as THREE from "three";
import { ctx } from "@/core/context";

const STUDIO_RIG = [
  // [width, height, color, intensity, position]
  [7.0, 4.5, 0xffffff, 3.8, [0, 7, 3]],    // top key softbox
  [9.0, 1.2, 0xdfe8f2, 3.2, [-8, 2, 1]],   // cool vertical strip, left
  [9.0, 0.9, 0xffd9a0, 2.6, [8, 0.5, -2]], // warm gold strip, right
  [6.0, 3.0, 0xffffff, 2.2, [0, 2, -8]],   // back rim card
  [10 , 10 , 0x0a0a0c, 1.0, [0, -8, 0]],   // dark floor bounce
];

export function createEnvironment() {
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x000000);

  STUDIO_RIG.forEach(([width, height, color, intensity, position]) => {
    const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
    material.color = new THREE.Color(color).multiplyScalar(intensity);
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
    panel.position.set(...position);
    panel.lookAt(0, 0, 0);
    envScene.add(panel);
  });

  const pmrem = new THREE.PMREMGenerator(ctx.renderer);
  ctx.scene.environment = pmrem.fromScene(envScene, 0.03).texture;
  pmrem.dispose();
}
