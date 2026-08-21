/**
 * Procedural watch — a development stand-in with the exact same part
 * contract as the production GLB (see watch/loader.js).
 *
 * Built dial-up along local +Y; every part is registered in the shared
 * registry so the scroll choreography can explode it individually.
 */
import * as THREE from "three";
import { ctx } from "@/core/context";
import { registerPart, parts, gearSpecs } from "@/core/state";
import { TESSELLATION, isLowPerf } from "@/config/capabilities";
import { makeGear, makeHand, applyShadows } from "./factories";

export function buildProceduralWatch() {
  ctx.watch = new THREE.Group();
  ctx.watch.name = "Watch";

  buildCase();
  buildBracelet();
  buildMovement();
  buildDial();
  buildHands();
  buildBezel();
  buildCrystal();
  buildCrown();

  applyShadows(ctx.watch);
  ctx.spinGroup.add(ctx.watch);
}

/* ---------- Case ---------- */

function buildCase() {
  const { steel, steelBrushed } = ctx.materials;
  const group = new THREE.Group();
  group.name = "Case";

  // mid-case: a lathe ring with an open centre, so the movement stays visible
  const profile = [
    new THREE.Vector2(1.44, -0.24),
    new THREE.Vector2(1.62, -0.3),
    new THREE.Vector2(1.73, -0.16),
    new THREE.Vector2(1.75, 0.08),
    new THREE.Vector2(1.66, 0.26),
    new THREE.Vector2(1.46, 0.27),
    new THREE.Vector2(1.44, -0.24),
  ];
  group.add(new THREE.Mesh(new THREE.LatheGeometry(profile, TESSELLATION.high), steel));

  const caseBack = new THREE.Mesh(
    new THREE.CylinderGeometry(1.46, 1.38, 0.07, TESSELLATION.medium),
    steelBrushed
  );
  caseBack.position.y = -0.27;
  group.add(caseBack);

  const lugGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.62);
  [-1, 1].forEach((sideX) =>
    [-1, 1].forEach((sideZ) => {
      const lug = new THREE.Mesh(lugGeometry, steel);
      lug.position.set(sideX * 1.06, -0.04, sideZ * 1.62);
      lug.rotation.x = sideZ * -0.16;
      group.add(lug);
    })
  );

  registerPart("case", group);
  ctx.watch.add(group);
}

/* ---------- Bracelet ---------- */

function buildBracelet() {
  const { steel, steelBrushed } = ctx.materials;
  const group = new THREE.Group();
  group.name = "Bracelet";

  const links = isLowPerf ? 5 : 7;
  const curveRadius = 3.4; // the strap drapes along this arc, away from the dial

  [-1, 1].forEach((direction) => {
    for (let i = 0; i < links; i++) {
      const taper = i / (links - 1);
      const width = 2.0 - taper * 0.5;

      // three-piece oyster-style link
      const link = new THREE.Group();
      const centre = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.4, 0.13, 0.36), steel);
      const left = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.27, 0.115, 0.38), steelBrushed);
      const right = left.clone();
      left.position.x = -width * 0.34;
      right.position.x = width * 0.34;
      link.add(centre, left, right);

      // place each link tangent to the arc so the strap wraps naturally
      const angle = i * 0.115;
      link.position.set(
        0,
        -0.06 - curveRadius * (1 - Math.cos(angle)),
        direction * (1.9 + curveRadius * Math.sin(angle))
      );
      link.rotation.x = direction * -angle;
      group.add(link);
    }
  });

  registerPart("bracelet", group);
  ctx.watch.add(group);
}

/* ---------- Movement ---------- */

const GEAR_TRAIN = [
  // radius, teeth, [x, y, z], speed, material key, node name
  { r: 0.44, teeth: 22, pos: [0.55, 0.09, 0.28], speed: 0.5, mat: "gold", name: "Gear01" },
  { r: 0.3, teeth: 16, pos: [-0.52, 0.09, 0.5], speed: -0.85, mat: "rhodium", name: "Gear02" },
  { r: 0.24, teeth: 14, pos: [-0.2, 0.09, -0.58], speed: 1.15, mat: "gold", name: "Gear03" },
  { r: 0.36, teeth: 18, pos: [0.42, 0.09, -0.42], speed: -0.65, mat: "rhodium", name: "Gear04" },
  { r: 0.18, teeth: 12, pos: [-0.02, 0.09, 0.72], speed: 1.6, mat: "gold", name: "Gear05" },
];

const BRIDGES = [
  { size: [1.7, 0.05, 0.38], pos: [0.15, 0.15, 0.1], rotY: 0.5, name: "Bridge01" },
  { size: [1.3, 0.05, 0.32], pos: [-0.3, 0.15, -0.45], rotY: -0.35, name: "Bridge02" },
  { size: [1.05, 0.05, 0.28], pos: [0.35, 0.15, 0.72], rotY: -0.9, name: "Bridge03" },
];

function buildMovement() {
  const { plate, gold, rhodium } = ctx.materials;
  const group = new THREE.Group();
  group.name = "Movement";

  const mainPlate = new THREE.Mesh(
    new THREE.CylinderGeometry(1.36, 1.36, 0.1, TESSELLATION.medium),
    plate
  );
  mainPlate.name = "MainPlate";
  group.add(mainPlate);
  parts.mainPlate = mainPlate;

  parts.gears = [];
  GEAR_TRAIN.forEach(({ r, teeth, pos, speed, mat, name }) => {
    const gear = makeGear(r, teeth, 0.045, ctx.materials[mat]);
    gear.name = name;
    gear.position.set(...pos);
    group.add(gear);
    parts.gears.push(gear);
    gearSpecs.push({ mesh: gear, speed });
  });

  group.add(buildBalanceWheel());

  parts.bridges = [];
  BRIDGES.forEach(({ size, pos, rotY, name }) => {
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(...size), rhodium);
    bridge.name = name;
    bridge.position.set(...pos);
    bridge.rotation.y = rotY;
    group.add(bridge);
    parts.bridges.push(bridge);

    // gold screws at each end of the bridge
    [-1, 1].forEach((side) => {
      const screw = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.03, 10), gold);
      screw.position.set(
        pos[0] + Math.cos(rotY) * side * size[0] * 0.42,
        pos[1] + 0.035,
        pos[2] - Math.sin(rotY) * side * size[0] * 0.42
      );
      group.add(screw);
    });
  });

  group.add(buildRotor());

  registerPart("movement", group);
  ctx.watch.add(group);
}

function buildBalanceWheel() {
  const { gold } = ctx.materials;
  const balance = new THREE.Group();
  balance.name = "BalanceWheel";

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.035, 12, TESSELLATION.low), gold);
  rim.rotation.x = Math.PI / 2;

  const spokeGeometry = new THREE.BoxGeometry(0.58, 0.02, 0.045);
  const spokeA = new THREE.Mesh(spokeGeometry, gold);
  const spokeB = spokeA.clone();
  spokeB.rotation.y = Math.PI / 2;

  balance.add(rim, spokeA, spokeB);
  balance.position.set(-0.72, 0.12, -0.28);
  parts.balance = balance;
  return balance;
}

function buildRotor() {
  const { gold, rhodium } = ctx.materials;

  const shape = new THREE.Shape();
  shape.absarc(0, 0, 1.02, 0, Math.PI, false);
  shape.lineTo(-0.34, 0);
  const cutout = new THREE.Path();
  cutout.absarc(0, 0.42, 0.26, 0, Math.PI * 2, true);
  shape.holes.push(cutout);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.045,
    bevelEnabled: false,
    curveSegments: TESSELLATION.low,
  });
  geometry.rotateX(-Math.PI / 2);

  const rotor = new THREE.Group();
  rotor.name = "Rotor";
  rotor.add(new THREE.Mesh(geometry, gold));
  rotor.add(
    new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.09, TESSELLATION.low), rhodium)
  );
  rotor.position.y = 0.2;
  parts.rotor = rotor;
  return rotor;
}

/* ---------- Dial ---------- */

function buildDial() {
  const { dial, gold } = ctx.materials;
  const group = new THREE.Group();
  group.name = "Dial";

  group.add(
    new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.045, TESSELLATION.medium), dial)
  );

  const minuteTrack = new THREE.Mesh(
    new THREE.TorusGeometry(1.28, 0.008, 8, TESSELLATION.medium), gold);
  minuteTrack.rotation.x = Math.PI / 2;
  minuteTrack.position.y = 0.026;
  group.add(minuteTrack);

  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const isCardinal = i % 3 === 0;
    const marker = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, 0.03, isCardinal ? 0.3 : 0.18),
      gold
    );
    marker.position.set(Math.sin(angle) * 1.1, 0.035, Math.cos(angle) * 1.1);
    marker.rotation.y = angle;
    group.add(marker);
  }

  group.position.y = 0.3;
  registerPart("dial", group);
  ctx.watch.add(group);
}

/* ---------- Hands ---------- */

const HANDS = [
  { key: "hourHand", name: "HourHand", length: 0.72, width: 0.07, mat: "rhodium", y: 0.365, angle: -Math.PI * 0.42 },
  { key: "minuteHand", name: "MinuteHand", length: 1.12, width: 0.05, mat: "rhodium", y: 0.395, angle: Math.PI * 0.7 },
  { key: "secondsHand", name: "SecondsHand", length: 1.24, width: 0.018, mat: "gold", y: 0.425, angle: 0, counterweight: true },
];

function buildHands() {
  HANDS.forEach(({ key, name, length, width, mat, y, angle, counterweight }) => {
    const hand = makeHand(length, width, ctx.materials[mat], { counterweight });
    hand.name = name;
    hand.position.y = y;
    hand.rotation.y = angle;
    registerPart(key, hand);
    ctx.watch.add(hand);
  });

  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.06, 0.1, 16), ctx.materials.gold);
  cap.position.y = 0.4;
  registerPart("handsCap", cap);
  ctx.watch.add(cap);
}

/* ---------- Bezel ---------- */

function buildBezel() {
  const { steel, steelBrushed } = ctx.materials;
  const group = new THREE.Group();
  group.name = "Bezel";

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.58, 0.14, 24, TESSELLATION.high), steel);
  ring.rotation.x = Math.PI / 2;
  ring.scale.set(1, 1, 0.75);
  group.add(ring);

  // coin-edge fluting
  const flutes = isLowPerf ? 48 : 90;
  const notchGeometry = new THREE.BoxGeometry(0.02, 0.1, 0.06);
  for (let i = 0; i < flutes; i++) {
    const angle = (i / flutes) * Math.PI * 2;
    const notch = new THREE.Mesh(notchGeometry, steelBrushed);
    notch.position.set(Math.cos(angle) * 1.71, 0, Math.sin(angle) * 1.71);
    notch.rotation.y = -angle;
    group.add(notch);
  }

  group.position.y = 0.33;
  registerPart("bezel", group);
  ctx.watch.add(group);
}

/* ---------- Crystal ---------- */

function buildCrystal() {
  const crystal = new THREE.Mesh(
    new THREE.CylinderGeometry(1.42, 1.47, 0.09, TESSELLATION.medium),
    ctx.materials.crystal
  );
  crystal.name = "Crystal";
  crystal.position.y = 0.42;
  crystal.renderOrder = 10;
  registerPart("crystal", crystal);
  ctx.watch.add(crystal);
}

/* ---------- Crown ---------- */

function buildCrown() {
  const { steel, steelBrushed, gold } = ctx.materials;
  const group = new THREE.Group();
  group.name = "Crown";

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.17, 0.16, TESSELLATION.low), steel);
  body.rotation.z = Math.PI / 2;

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 0.22, 12), steelBrushed);
  stem.rotation.z = Math.PI / 2;
  stem.position.x = -0.16;
  group.add(body, stem);

  const knurlGeometry = new THREE.BoxGeometry(0.16, 0.024, 0.05);
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2;
    const knurl = new THREE.Mesh(knurlGeometry, steelBrushed);
    knurl.position.set(0, Math.sin(angle) * 0.17, Math.cos(angle) * 0.17);
    knurl.rotation.x = -angle;
    group.add(knurl);
  }

  const crest = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.12, 0.03, TESSELLATION.low), gold);
  crest.rotation.z = Math.PI / 2;
  crest.position.x = 0.095;
  group.add(crest);

  group.position.set(1.9, 0.02, 0);
  registerPart("crown", group);
  ctx.watch.add(group);
}
