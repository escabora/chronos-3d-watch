/**
 * Reusable geometry factories — shared by every part builder.
 */
import * as THREE from "three";
import { ctx } from "@/core/context";
import { TESSELLATION, isLowPerf } from "@/config/capabilities";

/** A gear: body cylinder + radial teeth + hub + ruby jewel bearing. */
export function makeGear(radius, teeth, height, material) {
  const { rhodium, ruby } = ctx.materials;
  const gear = new THREE.Group();

  gear.add(
    new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, height, TESSELLATION.low),
      material
    )
  );

  const toothGeometry = new THREE.BoxGeometry(radius * 0.16, height, radius * 0.24);
  for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * Math.PI * 2;
    const tooth = new THREE.Mesh(toothGeometry, material);
    tooth.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    tooth.rotation.y = -angle;
    gear.add(tooth);
  }

  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.22, radius * 0.22, height * 2.2, TESSELLATION.low),
    rhodium
  );
  const jewel = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.1, radius * 0.1, height * 2.5, 12),
    ruby
  );
  gear.add(hub, jewel);

  return gear;
}

/** A watch hand: blade (+ optional counterweight), pivoted at the group origin. */
export function makeHand(length, width, material, { counterweight = false } = {}) {
  const hand = new THREE.Group();

  const blade = new THREE.Mesh(new THREE.BoxGeometry(width, 0.014, length), material);
  blade.position.z = length / 2 - (counterweight ? length * 0.12 : 0);
  hand.add(blade);

  if (counterweight) {
    const weight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.016, 16),
      material
    );
    weight.position.z = -length * 0.16;
    hand.add(weight);
  }

  return hand;
}

/** Enable shadows on every opaque mesh of a subtree (skipped on low-perf). */
export function applyShadows(object) {
  if (isLowPerf) return;
  object.traverse((node) => {
    if (node.isMesh && node.material !== ctx.materials.crystal) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
}
