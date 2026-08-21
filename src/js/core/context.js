/**
 * Shared scene context — everything the layers need to talk to each other.
 * Populated once during bootstrap; read everywhere else.
 */
export const ctx = {
  scene: null,
  camera: null,
  renderer: null,
  clock: null,

  // lights
  keyLight: null,
  rimLight: null,
  goldLight: null,
  hemiLight: null,

  // watch hierarchy: root (scale/turntable) → tilt (facing) → spin (idle)
  root: null,
  tiltGroup: null,
  spinGroup: null,
  watch: null,

  materials: {},
  responsiveScale: 1,
  ready: false,
};
