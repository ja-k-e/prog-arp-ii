import Note from "./Note";
import Scale from "./Scale";
import { ModeType } from "../../types/index";
import Interval from "./Interval";

export default class Dictionary {
  readonly scales: { [K in ModeType]: Scale };

  constructor() {
    this.scales = {
      // minor: new Scale(Scale.params.aeolian),
      // major: new Scale(Scale.params.ionian),
      aeolian: new Scale(Scale.params.aeolian),
      dorian: new Scale(Scale.params.dorian),
      ionian: new Scale(Scale.params.ionian),
      locrian: new Scale(Scale.params.locrian),
      lydian: new Scale(Scale.params.lydian),
      harmonic: new Scale(Scale.params.harmonic),
      melodic: new Scale(Scale.params.melodic),
      mixolydian: new Scale(Scale.params.mixolydian),
      phrygian: new Scale(Scale.params.phrygian)
    };
  }

  generateIntervals(root: Note, scale: Scale) {
    return scale.steps.map((step, i) => new Interval(root, scale, step, i));
  }
}
