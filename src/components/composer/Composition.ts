import Dictionary from "./Dictionary";
import Interval from "./Interval";
import Note from "./Note";
import Scale from "./Scale";
import { ModeType, RootType } from "../../types/index";

export default class Composition {
  readonly dictionary: Dictionary;
  mode: ModeType;
  scale: Scale;
  root: Note;
  intervals: ReadonlyArray<Interval>;

  constructor(root: RootType, mode: ModeType) {
    this.dictionary = new Dictionary();
    this.updateScale(root, mode);
  }

  updateScale(root: RootType, mode: ModeType) {
    this.root = new Note(root);
    this.mode = mode;
    this.scale = this.dictionary.scales[mode];
    this.intervals = this.dictionary.generateIntervals(this.root, this.scale);
  }
}
