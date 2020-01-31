import { IntervalType } from "../../types/index";
import Note, { ROOTS } from "./Note";

const TRIAD_STEPS = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8]
};

export default class Triad {
  readonly interval: string;
  readonly notes: ReadonlyArray<{ note: Note; octave: number }>;
  readonly type: IntervalType;

  constructor(
    step: number,
    offset: number,
    octave: number,
    type: IntervalType
  ) {
    this.type = type;
    this.interval = Triad.intervalFromType(step, type);
    const len = ROOTS.length;
    this.notes = TRIAD_STEPS[type].map(s => ({
      note: new Note(ROOTS[(offset + s) % len]),
      octave: offset + s > len - 1 ? octave + 1 : octave
    }));
  }

  static intervalFromType(step: number, type: IntervalType) {
    let s = "i ii iii iv v vi vii".split(" ")[step];
    switch (type) {
      case "maj":
        return s.toUpperCase();
      case "min":
        return s;
      case "aug":
        return `${s.toUpperCase()}+`;
      case "dim":
        return `${s}°`;
    }
  }
}
