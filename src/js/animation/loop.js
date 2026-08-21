/**
 * Render loop — the mechanics keep living while the scroll is at rest
 * (gears, rotor, balance wheel, ticking seconds hand, idle spin),
 * but every part's *position* is always owned by the scroll state.
 */
import { ctx } from "@/core/context";
import { animationState as anim, parts, gearSpecs } from "@/core/state";
import { prefersReducedMotion } from "@/config/capabilities";
import { MECHANICS } from "@/config/settings";
import { applyAnimationState } from "./apply-state";

const MAX_DELTA = 0.05;

export function startRenderLoop() {
  requestAnimationFrame(startRenderLoop);
  if (!ctx.ready) return;

  const delta = Math.min(ctx.clock.getDelta(), MAX_DELTA);
  const elapsed = ctx.clock.elapsedTime;

  if (!prefersReducedMotion) {
    // idle spin around the dial axis (intro + finale)
    ctx.spinGroup.rotation.y += anim.spinSpeed * delta;
    // breathing tilt — barely perceptible, keeps the object alive
    ctx.spinGroup.rotation.z =
      Math.sin(elapsed * MECHANICS.BREATHING_FREQUENCY) * MECHANICS.BREATHING_AMPLITUDE;

    // the seconds hand ticks softly all the time
    if (parts.secondsHand) {
      parts.secondsHand.rotation.y -= delta * MECHANICS.SECONDS_HAND_SPEED;
    }
  }

  updateMechanics(delta, elapsed);
  applyAnimationState();
  ctx.renderer.render(ctx.scene, ctx.camera);
}

function updateMechanics(delta, elapsed) {
  const intensity = anim.gearSpeed;
  if (intensity <= 0.001) return;

  gearSpecs.forEach(({ mesh, speed }) => {
    mesh.rotation.y += speed * intensity * delta * MECHANICS.GEAR_SPEED_MULTIPLIER;
  });

  if (parts.rotor) {
    // pendulum swing of the automatic winding rotor
    parts.rotor.rotation.y =
      Math.sin(elapsed * MECHANICS.ROTOR_FREQUENCY) * MECHANICS.ROTOR_SWING * intensity;
  }

  if (parts.balance) {
    parts.balance.rotation.y =
      Math.sin(elapsed * MECHANICS.BALANCE_FREQUENCY) *
      MECHANICS.BALANCE_AMPLITUDE *
      intensity;
  }
}
