import Interval from "../composer/Interval";

export default class Arp {
  length: number;
  step: number;
  container: HTMLElement;
  $: Array<HTMLElement>;
  pattern: Array<Array<number>>;

  constructor(container: HTMLElement) {
    this.container = container;
    this.$ = [
      container.querySelector("#arp-0"),
      container.querySelector("#arp-1"),
      container.querySelector("#arp-2"),
      container.querySelector("#arp-3")
    ];
    this.pattern = [
      [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 2, 0],
      [0, 1, 0, 2, 0, 1, 0, 1, 0, 2, 0, 2],
      [1, 0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0],
      // bass
      [1, 0, 1, 0, 2, 0, 1, 0, 2, 1, 0, 1]
    ];
    this.step = 0;
    this.length = 12;
    this.build();
  }

  build() {
    this.$.forEach((row, i) => {
      for (let j = 0; j < 12; j++) {
        const $btn = document.createElement("button");
        $btn.innerHTML = "&nbsp;";
        $btn.addEventListener("click", () => this.cycleState(i, j));
        if (this.pattern[i][j])
          $btn.classList.add(`state-${this.pattern[i][j]}`);
        row.appendChild($btn);
      }
    });
  }

  cycleState(row: number, column: number) {
    const current = this.pattern[row][column];
    const value = (current + 1) % 3;
    this.pattern[row][column] = value;
    const btn = this.$[row].querySelector(`button:nth-child(${column + 1})`);
    btn.classList.remove(`state-${current}`);
    if (value > 0) btn.classList.add(`state-${value}`);
  }

  tick(interval: Interval) {
    const i = this.step % this.length;
    const [n0, n1, n2, n3] = this.pattern.map(r => r[i]);
    const { notes } = interval.triad;
    this.container.className = `active-${i + 1}`;
    this.step++;
    return [
      n0 ? `${notes[2].note.name}${notes[2].octave + n0 + 3}` : null,
      n1 ? `${notes[1].note.name}${notes[1].octave + n1 + 3}` : null,
      n2 ? `${notes[0].note.name}${notes[0].octave + n2 + 3}` : null,
      n3 ? `${notes[0].note.name}${notes[0].octave + n3 + 0}` : null
    ];
  }
}
