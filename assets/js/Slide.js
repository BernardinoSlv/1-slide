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

  /**
   * coloca a classe active no elemento do index e remove do anterior
   *
   * @param {Number} index
   */
  #activeByIndex(index)
  {
    this.#slideThumbElem.querySelector(".active").classList.remove("active");
    this.#slideThumbElem.querySelector(`li[data-index="${index}"]`).classList.add("active");

    this.#slideImagesElem.querySelector(".active").classList.remove("active");
    this.#slideImagesElem.querySelector(`[data-index="${index}"]`).classList.add("active");
  }

  #initSlideThumb()
  {
    this.#slideElem.querySelectorAll(".slide-thumb li").forEach((slideThumbItem) => {
      slideThumbItem.addEventListener("click", (event) => {
        const index = slideThumbItem.dataset.index;
        const slideImageItemElem = this.#slideImagesElem
          .querySelector(`.item[data-index="${index}"]`);

        this.#activeByIndex(index);

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

  /**
   * move para a imagem mais próxima
   */
  #moveCloser()
  {
    const slideImageItemElements = Array.from(this.#slideImagesElem.querySelectorAll(".item"));
    const scrollX = this.#slideImagesElem.scrollLeft;

    for (const itemElem of slideImageItemElements) {
      const clientRect = itemElem.getClientRects()[0];
      const paddingLeftSize = parseInt(getComputedStyle(this.#slideImagesElem).paddingLeft);

      if (clientRect.left + 200 >= 0) {
        this.#activeByIndex(itemElem.dataset.index);
        this.#slideImagesElem.scroll({
          left: scrollX + clientRect.left - (paddingLeftSize / 2),
          behavior: "smooth"
        });
        break;
      }
    }
  }

  #initSlideImages()
  {
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
      this.#moveCloser();
    });
    
    this.#slideImagesElem.addEventListener("mouseleave", () => {
      this.#slideImagesElem.removeEventListener("mousemove", handleMouseMove);
      this.#moveCloser()
    });
  }

  init()
  {
    this.#moveCloser();
    this.#initSlideThumb();
    this.#initSlideImages();
  }
}
