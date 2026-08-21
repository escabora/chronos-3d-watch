/**
 * Cinematic studio lighting: key + cool rim + warm gold accent + hemisphere fill.
 * The key and gold intensities are driven by the scroll timeline.
 */
import * as THREE from "three";
import { ctx } from "@/core/context";
import { RENDERING } from "@/config/settings";
import { isLowPerf } from "@/config/capabilities";

export function createLights() {
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
  keyLight.position.set(3.5, 5.5, 4.0);

  if (!isLowPerf) {
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(RENDERING.SHADOW_MAP_SIZE, RENDERING.SHADOW_MAP_SIZE);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5;
    keyLight.shadow.camera.bottom = -5;
    keyLight.shadow.bias = -0.0004;
  }

  // cool rim — carves the silhouette out of the dark
  const rimLight = new THREE.PointLight(0xbfd2e6, 14, 34, 1.8);
  rimLight.position.set(-5.5, 2.5, -4.5);

  // warm gold accent — intensity driven by the scroll timeline
  const goldLight = new THREE.PointLight(0xffcf8a, 0, 22, 1.9);
  goldLight.position.set(2.8, 1.2, 3.2);

  const hemiLight = new THREE.HemisphereLight(0x3b414b, 0x050505, 0.55);

  Object.assign(ctx, { keyLight, rimLight, goldLight, hemiLight });
  ctx.scene.add(keyLight, rimLight, goldLight, hemiLight);
}
