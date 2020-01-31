import Interval from "../composer/Interval";
import Composition from "../composer/Composition";
import Controller from "../controller/Controller";
import accidentals from "../../util/accidentals";

export class Intervals {
  readonly $: HTMLElement;
  readonly buttons: Array<HTMLElement>;

  constructor(
    container: HTMLElement,
    composition: Composition,
    controller: Controller
  ) {
    this.$ = container;
    this.buttons = [];
    for (let i = 0; i < 7; i++) {
      const button = document.createElement("button");
      button.addEventListener("click", () =>
        controller.methods.updateInterval(i)
      );
      this.$.appendChild(button);
      this.buttons.push(button);
    }
    this.handleActiveKeyChange(composition.intervals);
  }

  clear() {
    const active = this.$.querySelector("button.active");
    if (active) active.classList.remove("active");
  }

  handleActiveIntervalChange(currentIndex: number) {
    this.clear();
    this.buttons[currentIndex].classList.add("active");
  }

  handleActiveKeyChange(intervals: ReadonlyArray<Interval>) {
    intervals.forEach(({ note, step, triad }) => {
      const { type, interval } = triad;
      const button = this.buttons[step];
      const name = accidentals(note.name);
      button.innerHTML = `<span>${name} ${type}</span> <span>${interval}</span>`;
    });
  }
}
