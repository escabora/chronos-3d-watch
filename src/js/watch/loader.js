/**
 * Model loading — GLB-first with a procedural fallback.
 *
 * Drop a production model at ASSETS.WATCH_MODEL whose nodes follow
 * NODE_CONTRACT below and it replaces the procedural mock with zero
 * changes anywhere else in the codebase.
 */
import * as THREE from "three";
import { ctx } from "@/core/context";
import { registerPart, parts, gearSpecs } from "@/core/state";
import { ASSETS } from "@/config/settings";
import { buildProceduralWatch } from "./procedural";
import { applyShadows } from "./factories";

/** GLB node-name contract — see README for the authoring guidelines. */
const NODE_CONTRACT = {
  case: "Case",
  bezel: "Bezel",
  crystal: "Crystal",
  crown: "Crown",
  dial: "Dial",
  hourHand: "HourHand",
  minuteHand: "MinuteHand",
  secondsHand: "SecondsHand",
  movement: "Movement",
  bracelet: "Bracelet",
};

const MAX_GEARS = 8;
const MAX_BRIDGES = 3;

export async function loadWatch() {
  buildHierarchy();

  const model = await tryLoadProductionModel();
  if (!model) buildProceduralWatch();
}

/** root (scale/turntable) → tilt (facing) → spin (idle rotation). */
function buildHierarchy() {
  ctx.root = new THREE.Group();
  ctx.tiltGroup = new THREE.Group();
  ctx.spinGroup = new THREE.Group();
  ctx.root.add(ctx.tiltGroup);
  ctx.tiltGroup.add(ctx.spinGroup);
  ctx.scene.add(ctx.root);
}

async function tryLoadProductionModel() {
  try {
    const probe = await fetch(ASSETS.WATCH_MODEL, { method: "HEAD" });
    if (!probe.ok) return null;

    const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
    const gltf = await new GLTFLoader().loadAsync(ASSETS.WATCH_MODEL);
    collectParts(gltf.scene);
    console.info("CHRONOS · production GLB loaded");
    return gltf.scene;
  } catch {
    console.info("CHRONOS · no GLB found, using the procedural model");
    return null;
  }
}

function collectParts(model) {
  ctx.watch = model;

  Object.entries(NODE_CONTRACT).forEach(([key, nodeName]) => {
    const node = model.getObjectByName(nodeName);
    if (node) registerPart(key, node);
    else console.warn(`CHRONOS · GLB is missing node "${nodeName}"`);
  });

  parts.gears = [];
  gearSpecs.length = 0;
  for (let i = 1; i <= MAX_GEARS; i++) {
    const gear = model.getObjectByName(`Gear0${i}`);
    if (!gear) continue;
    parts.gears.push(gear);
    gearSpecs.push({ mesh: gear, speed: (i % 2 ? 1 : -1) * (0.4 + i * 0.18) });
  }

  parts.bridges = [];
  for (let i = 1; i <= MAX_BRIDGES; i++) {
    const bridge = model.getObjectByName(`Bridge0${i}`);
    if (bridge) parts.bridges.push(bridge);
  }

  parts.rotor = model.getObjectByName("Rotor") || null;
  parts.balance = model.getObjectByName("BalanceWheel") || null;

  applyShadows(model);
  ctx.spinGroup.add(model);
}
