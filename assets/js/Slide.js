export default class Slide {
  #slideElem;
  #slideThumbElem;
  #slideImagesElem;

  /**
   * @param {Element} elem
   */
  constructor(elem)
  {
    this.#slideElem = elem;
    this.#slideThumbElem = elem.querySelector(".slide-thumb");
    this.#slideImagesElem = elem.querySelector(".slide-images");
  }

  #initSlideThumb()
  {
    this.#slideElem.querySelectorAll(".slide-thumb li").forEach((slideThumbItem) => {
      slideThumbItem.addEventListener("click", (event) => {
        const index = slideThumbItem.dataset.index;
        const slideImageItemElem = this.#slideImagesElem
          .querySelector(`.item[data-index="${index}"]`);

        // mudando active do slide-thumb
        this.#slideThumbElem.querySelector("li.active").classList.remove("active");
        slideThumbItem.classList.add("active");

        // mudando active do slide-images
        this.#slideImagesElem.querySelector(".item.active").classList.remove("active");
        slideImageItemElem.classList.add("active");

        // mudar a posição do scrool
        const leftTarget = slideImageItemElem.getClientRects()[0].left;
        const currentScrollLeft = this.#slideImagesElem.scrollLeft;
        const paddingLeftSize = parseInt(getComputedStyle(this.#slideImagesElem).paddingLeft);
        this.#slideImagesElem.scroll({
          left: (leftTarget + currentScrollLeft) - (paddingLeftSize / 2),
          behavior: "smooth"
        });
      });
    })
  }

  #initSlideImages()
  {
    const slideImageItemElements = Array.from(this.#slideImagesElem.querySelectorAll(".item"));

    let lastMousePositionX = 0;
    const handleMouseMove = (event) => {
      const movedX = parseInt((event.clientX - lastMousePositionX));
      this.#slideImagesElem.scroll({
        left: this.#slideImagesElem.scrollLeft + (movedX * -1)
      });
      lastMousePositionX = event.clientX;
    }
    this.#slideImagesElem.addEventListener("mousedown", (event) => {
      lastMousePositionX = event.clientX;
      this.#slideImagesElem.addEventListener("mousemove", handleMouseMove);
    });
    this.#slideImagesElem.addEventListener("mouseup", () => {
      this.#slideImagesElem.removeEventListener("mousemove", handleMouseMove);
      const scrollX = this.#slideImagesElem.scrollLeft;

      for (const itemElem of slideImageItemElements) {
        const clientRect = itemElem.getClientRects()[0];
        const paddingLeftSize = parseInt(getComputedStyle(this.#slideImagesElem).paddingLeft);

        if (clientRect.left + 200 >= 0) {
          const index = itemElem.dataset.index;
          this.#slideImagesElem.querySelector(".active").classList.remove("active");
          itemElem.classList.add("active");
          this.#slideElem.querySelector(".slide-thumb .active").classList.remove("active");
          this.#slideElem.querySelector(`.slide-thumb [data-index="${index}"]`).classList.add("active");
          this.#slideImagesElem.scroll({
            left: scrollX + clientRect.left - (paddingLeftSize / 2),
            behavior: "smooth"
          });
          break;
        }
        // if (clientRect.right >= 300) {
        //   this.#slideImagesElem.querySelector(".active").classList.remove("active");
        //   itemElem.classList.add("active");
        //   console.log("right > 300");
        //   this.#slideImagesElem.scroll({
        //     left: scrollX + clientRect.left - (paddingLeftSize / 2),
        //     behavior: "smooth"
        //   });
        //   break;
        // }
      }
    });
    this.#slideImagesElem.addEventListener("mouseleave", () => {
      console.log("saiu");
    });
  }

  init()
  {
    this.#initSlideThumb();
    this.#initSlideImages();
  }
}
