export type IntervalType = "maj" | "min" | "aug" | "dim";

export type ModeType =
  // | "minor"
  // | "major"
  | "ionian"
  | "dorian"
  | "phrygian"
  | "lydian"
  | "mixolydian"
  | "aeolian"
  | "locrian"
  | "melodic"
  | "harmonic";

export type RootNaturalType = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type RootSharpType = "C#" | "D#" | "E" | "F#" | "G#" | "A#" | "B";
export type RootFlatType = "Cb" | "Db" | "Eb" | "Fb" | "Gb" | "Ab" | "Bb";
export type RootSharpScaleType = RootNaturalType | RootSharpType;
export type RootFlatScaleType = RootNaturalType | RootFlatType;
export type RootType = RootNaturalType | RootSharpType | RootFlatType;
