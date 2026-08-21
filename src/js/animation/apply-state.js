/**
 * Pushes the scroll-driven animation state onto the scene graph.
 * The only module that maps state → objects, for both mock and GLB.
 */
import { ctx } from "@/core/context";
import { animationState as anim, parts, basePositions, mouse } from "@/core/state";

const PARALLAX = { x: 0.28, y: 0.18 };
const KEY_LIGHT_SCALE = 2.0;
const GOLD_LIGHT_SCALE = 9;

/** part key → vertical explode offset, resolved from the current state. */
const EXPLODE_OFFSETS = [
  ["crystal", (a) => a.crystalY],
  ["bezel", (a) => a.bezelY],
  ["dial", (a) => a.dialY],
  ["hourHand", (a) => a.handsY * 0.92],
  ["minuteHand", (a) => a.handsY * 1.06],
  ["secondsHand", (a) => a.handsY * 1.2],
  ["handsCap", (a) => a.handsY * 1.1],
  ["case", (a) => a.caseY],
  ["bracelet", (a) => a.braceletY],
  ["movement", (a) => a.movementY],
];

export function applyAnimationState() {
  // camera + subtle pointer parallax
  ctx.camera.position.set(
    anim.camX + mouse.x * PARALLAX.x,
    anim.camY + mouse.y * PARALLAX.y,
    anim.camZ
  );
  ctx.camera.lookAt(anim.tgX, anim.tgY, anim.tgZ);

  // watch orientation
  ctx.root.position.y = anim.rootY;
  const scale = anim.rootScale * ctx.responsiveScale;
  ctx.root.scale.set(scale, scale, scale);
  ctx.root.rotation.y = anim.turntable;
  ctx.tiltGroup.rotation.x = anim.tilt; // PI/2 = dial faces camera · 0 = faces sky

  // exploded-view offsets
  EXPLODE_OFFSETS.forEach(([key, offsetOf]) => {
    const part = parts[key];
    const base = part && basePositions.get(part);
    if (base) part.position.y = base.y + offsetOf(anim);
  });

  // the crown slides out of the case — and travels with it during the explosion
  const crownBase = parts.crown && basePositions.get(parts.crown);
  if (crownBase) {
    parts.crown.position.x = crownBase.x + anim.crownOut;
    parts.crown.position.y = crownBase.y + anim.caseY;
  }

  // lights
  ctx.keyLight.intensity = anim.keyLight * KEY_LIGHT_SCALE;
  ctx.goldLight.intensity = anim.goldLight * GOLD_LIGHT_SCALE;
}
