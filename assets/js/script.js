import Slide from "./Slide.js";

window.addEventListener("load", () => {
  document.querySelectorAll(".slide").forEach(elem => (new Slide(elem)).init());
});
