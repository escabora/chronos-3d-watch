/**
 * Watch materials — physically based, tuned for the studio environment.
 */
import * as THREE from "three";
import { ctx } from "@/core/context";
import { COLORS } from "@/config/settings";

export function createWatchMaterials() {
  ctx.materials = {
    steel: new THREE.MeshStandardMaterial({
      color: COLORS.STEEL, metalness: 1.0, roughness: 0.24, envMapIntensity: 1.0,
    }),
    steelBrushed: new THREE.MeshStandardMaterial({
      color: COLORS.STEEL_BRUSHED, metalness: 1.0, roughness: 0.46, envMapIntensity: 0.85,
    }),
    graphite: new THREE.MeshStandardMaterial({
      color: COLORS.GRAPHITE, metalness: 0.9, roughness: 0.5, envMapIntensity: 0.8,
    }),
    dial: new THREE.MeshStandardMaterial({
      color: COLORS.DIAL, metalness: 0.78, roughness: 0.34, envMapIntensity: 1.1,
    }),
    gold: new THREE.MeshStandardMaterial({
      color: COLORS.GOLD, metalness: 1.0, roughness: 0.24, envMapIntensity: 1.35,
    }),
    plate: new THREE.MeshStandardMaterial({
      color: COLORS.PLATE, metalness: 1.0, roughness: 0.44, envMapIntensity: 1.0,
    }),
    rhodium: new THREE.MeshStandardMaterial({
      color: COLORS.RHODIUM, metalness: 1.0, roughness: 0.3, envMapIntensity: 1.15,
    }),
    ruby: new THREE.MeshStandardMaterial({
      color: COLORS.RUBY, metalness: 0.15, roughness: 0.18,
      emissive: 0x2b0308, envMapIntensity: 1.4,
    }),
    crystal: new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0, roughness: 0.02,
      transmission: 1.0, thickness: 0.2, ior: 1.52,
      transparent: true, clearcoat: 0.6, clearcoatRoughness: 0.04,
      envMapIntensity: 0.5, depthWrite: false,
    }),
  };
}
