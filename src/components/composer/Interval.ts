import Note, { ROOTS } from "./Note";
import Triad from "./Triad";
import Scale from "./Scale";

export default class Interval {
  readonly step: number;
  readonly note: Note;
  readonly octave: number;
  readonly triad: Triad;

  constructor(root: Note, scale: Scale, step: number, index: number) {
    // starting index for root loop
    let offset = Note.stepFromRoot(root.name);
    let idx = (offset + step) % ROOTS.length;
    // relative octave. 0 = same as root, 1 = next octave up
    let octave = offset + step > ROOTS.length - 1 ? 1 : 0;
    this.step = index;
    this.note = new Note(ROOTS[idx]);
    this.octave = octave;
    this.triad = new Triad(index, idx, octave, scale.triads[index]);
  }
}
