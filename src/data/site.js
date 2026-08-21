/**
 * Single source of truth for all page copy.
 * Consumed by the Nunjucks templates at build time — edit here, never in HTML.
 */
module.exports = {
  title: "CHRONOS — Time, unfolded.",
  description: "An immersive, scroll-driven 3D journey inside a mechanical timepiece.",
  brand: { name: "CHRONOS", tagline: "GENÈVE · EST. MMXXVI" },
  loader: { label: "LOADING EXPERIENCE" },
  sections: [
    {
      id: "s1",
      index: "01",
      tag: "h1",
      xl: true,
      layout: "center",
      lines: [{ text: "TIME," }, { text: "unfolded.", serif: true }],
      sub: "The art of precision,<br />revealed.",
      scrollHint: "SCROLL TO EXPLORE",
    },
    {
      id: "s2",
      index: "02",
      layout: "left",
      kicker: "02 — THE SILHOUETTE",
      lines: [{ text: "Designed" }, { text: "to be remembered.", serif: true }],
      labels: ["904L STEEL", "PRECISION CASE", "SAPPHIRE CRYSTAL"],
      labelsSide: "right",
    },
    {
      id: "s3",
      index: "03",
      layout: "right",
      kicker: "03 — THE CROWN",
      lines: [{ text: "Precision" }, { text: "starts here.", serif: true }],
      sub: "Every interaction<br />is engineered with purpose.",
    },
    {
      id: "s4",
      index: "04",
      layout: "left",
      kicker: "04 — THE DIAL",
      lines: [{ text: "Under" }, { text: "the surface.", serif: true }],
      sub: "Layer by layer,<br />the architecture of time.",
    },
    {
      id: "s5",
      index: "05",
      layout: "center",
      top: true,
      kicker: "05 — THE MOVEMENT",
      lines: [{ text: "Where time" }, { text: "comes alive.", serif: true }],
    },
    {
      id: "s6",
      index: "06",
      layout: "right",
      kicker: "06 — THE DETAILS",
      lines: [{ text: "Nothing" }, { text: "accidental.", serif: true }],
      labels: ["PRECISION", "MICRO-ENGINEERING", "MECHANICAL MOVEMENT"],
      labelsSide: "left",
    },
    {
      id: "s7",
      index: "07",
      xl: true,
      layout: "center",
      kicker: "07 — THE COMPLETE PIECE",
      lines: [{ text: "Built for" }, { text: "every second.", serif: true }],
      cta: "DISCOVER THE COLLECTION",
    },
  ],
};
