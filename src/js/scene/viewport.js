/**
 * Responsive controller — one place decides how the stage adapts.
 */
import { ctx } from "@/core/context";
import { CAMERA, VIEWPORT } from "@/config/settings";
import { isMobileViewport, getMaxPixelRatio } from "@/config/capabilities";

export function handleResize() {
  const mobile = isMobileViewport();

  ctx.camera.aspect = window.innerWidth / window.innerHeight;
  ctx.camera.fov = mobile ? CAMERA.FOV_MOBILE : CAMERA.FOV_DESKTOP;
  ctx.camera.updateProjectionMatrix();

  ctx.responsiveScale = mobile ? VIEWPORT.MODEL_SCALE_MOBILE : 1;

  ctx.renderer.setSize(window.innerWidth, window.innerHeight);
  ctx.renderer.setPixelRatio(getMaxPixelRatio());
}
