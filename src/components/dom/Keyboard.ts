import Composition from "../composer/Composition";
import { RootType } from "../../types/index";
import Note from "../composer/Note";

export default class Keyboard {
  readonly $: HTMLElement;
  readonly composition: Composition;

  constructor(container: HTMLElement, composition: Composition) {
    this.$ = container;
    this.composition = composition;
    this.updateScale();
  }

  clear() {
    this.$.querySelectorAll(".active").forEach($ =>
      $.classList.remove("active")
    );
    this.$.querySelectorAll(".arp").forEach($ => $.classList.remove("arp"));
    this.$.querySelectorAll(".arp-harm").forEach($ =>
      $.classList.remove("arp-harm")
    );
    this.$.querySelectorAll(".high").forEach($ => $.classList.remove("high"));
  }

  tick(notes: ReadonlyArray<{ note: Note; octave: number }>) {
    this.clear();
    notes.forEach(({ note, octave }) =>
      this.$.querySelector(this.noteClassName(note.name, octave)).classList.add(
        "active"
      )
    );
  }

  updateScale() {
    this.$.querySelectorAll(".on").forEach($ => $.classList.remove("on"));
    this.composition.intervals.forEach(({ triad }) => {
      triad.notes.forEach(n => {
        this.$.querySelector(
          this.noteClassName(n.note.name, n.octave)
        ).classList.add("on");
      });
    });
  }

  noteClassName(name: RootType, octave: number) {
    return `.${name.toLowerCase().replace("#", "s")}${octave}`;
  }
}
