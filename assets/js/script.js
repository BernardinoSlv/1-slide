import Slide from "./Slide.js";

window.addEventListener("load", () => {
  const slide = new Slide(document.querySelector(".slide"));

  slide.init();
});
