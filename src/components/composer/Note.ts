import {
  RootType,
  RootFlatScaleType,
  RootSharpScaleType,
  RootFlatType,
  RootSharpType
} from "../../types/index";

export const ROOTS = <Array<RootType>>[
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B"
];

const FLAT_TO_SHARP = <{ [K in RootFlatType]: RootSharpScaleType }>{
  Cb: "B",
  Db: "C#",
  Eb: "D#",
  Fb: "E",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#"
};
const SHARP_TO_FLAT = <{ [K in RootSharpType]: RootFlatType }>{
  "C#": "Db",
  "D#": "Eb",
  E: "Fb",
  "F#": "Gb",
  "G#": "Ab",
  "A#": "Bb",
  B: "Cb"
};

export default class Note {
  readonly name: RootSharpScaleType;
  readonly nameAlt: RootFlatScaleType;
  readonly nameIsSharp: boolean;
  readonly nameAltIsFlat: boolean;

  constructor(note: RootType) {
    this.name = Note.flatToSharp(note);
    this.nameAlt = Note.sharpToFlat(this.name);
    this.nameIsSharp = !!note.match("#");
    this.nameAltIsFlat = !!this.nameAlt.match("b");
  }

  static flatToSharp(note: RootType): RootSharpScaleType {
    return FLAT_TO_SHARP[<RootFlatType>note] || <RootSharpScaleType>note;
  }
  static sharpToFlat(note: RootType): RootFlatScaleType {
    return SHARP_TO_FLAT[<RootSharpType>note] || <RootFlatScaleType>note;
  }

  static stepFromRoot(root: RootType) {
    return ROOTS.indexOf(Note.flatToSharp(root));
  }
}
