/**
 * Application settings — the single source of truth for every tunable value.
 * No other module declares constants that live here.
 */
export const ASSETS = {
  // Drop a production model at this path and it replaces the procedural
  // watch automatically (see watch/loader.js and README).
  WATCH_MODEL: "./assets/models/watch.glb",
};

export const CAMERA = {
  FOV_DESKTOP: 38,
  FOV_MOBILE: 46,
  NEAR: 0.1,
  FAR: 60,
};

export const VIEWPORT = {
  MOBILE_MAX_WIDTH: 820,
  MODEL_SCALE_MOBILE: 0.82,
};

export const RENDERING = {
  EXPOSURE: 1.05,
  MAX_DPR: 2,
  MAX_DPR_LOW_PERF: 1.5,
  SHADOW_MAP_SIZE: 1024,
};

export const COLORS = {
  BACKGROUND: 0x080808,
  STEEL: 0xcfd3d9,
  STEEL_BRUSHED: 0x9ba1a9,
  GRAPHITE: 0x24272b,
  DIAL: 0x0b0d10,
  GOLD: 0xc4a15f,
  PLATE: 0x9d8d68,
  RHODIUM: 0xc2c6cc,
  RUBY: 0x8a1626,
};

/** Living-mechanics parameters used by the render loop. */
export const MECHANICS = {
  SECONDS_HAND_SPEED: (Math.PI * 2) / 60, // rad/s — one revolution per minute
  GEAR_SPEED_MULTIPLIER: 2.2,
  ROTOR_SWING: 1.35,
  ROTOR_FREQUENCY: 0.85,
  BALANCE_AMPLITUDE: 0.75,
  BALANCE_FREQUENCY: 9, // ≈3 Hz beat, scaled for readability
  BREATHING_AMPLITUDE: 0.012,
  BREATHING_FREQUENCY: 0.4,
};
