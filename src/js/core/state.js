/**
 * Animation state — the single object the scroll timeline tweens.
 * The render loop applies it to the scene every frame (animation/apply-state.js),
 * which keeps the choreography 100% independent from whichever model
 * (procedural or GLB) is currently loaded.
 */
export const animationState = {
  // camera
  camX: 0, camY: 1.5, camZ: 16.5,
  tgX: 0, tgY: 0, tgZ: 0,

  // watch orientation
  rootY: -1.15,          // vertical emerge offset
  rootScale: 0.94,
  turntable: 0,          // rotation around world Y
  tilt: Math.PI / 2,     // PI/2 = dial faces camera · 0 = dial faces sky
  spinSpeed: 0.1,        // idle rotation speed around the dial axis

  // exploded-view offsets (local Y, added to each part's base position)
  crystalY: 0, bezelY: 0, dialY: 0, handsY: 0,
  caseY: 0, braceletY: 0, movementY: 0,
  crownOut: 0,

  // mechanics + light
  gearSpeed: 0,
  keyLight: 0.55,
  goldLight: 0,
};

/** Named, individually animatable parts (same registry for mock and GLB). */
export const parts = {};

/** part → original local position, so explode offsets are always relative. */
export const basePositions = new Map();

/** [{ mesh, speed }] — populated by whichever model is loaded. */
export const gearSpecs = [];

/** Normalized pointer position, used for camera parallax. */
export const mouse = { x: 0, y: 0 };

export function registerPart(key, object) {
  parts[key] = object;
  basePositions.set(object, object.position.clone());
}
