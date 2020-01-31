import { IntervalType } from "../../types/index";

export interface ScaleArgs {
  steps: string;
  dominance: string;
  name: string;
  triadOffset?: number;
  triads?: ReadonlyArray<IntervalType>;
}

export default class Scale {
  readonly dominance: ReadonlyArray<number>;
  readonly name: string;
  readonly steps: ReadonlyArray<number>;
  readonly triads: ReadonlyArray<IntervalType>;

  constructor(args: ScaleArgs) {
    this.name = args.name;
    this.steps = this.generateSteps(args.steps);
    this.dominance = args.dominance.split("").map((a: string) => parseInt(a));
    this.triads =
      args.triadOffset === undefined
        ? args.triads
        : this.generateTriads(args.triadOffset);
  }

  generateSteps(stepsString: string) {
    let arr = stepsString.split("");
    let steps = [0];
    let step = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      let inc = 0;
      switch (arr[i]) {
        case "W":
          inc = 2;
          break;
        case "H":
          inc = 1;
          break;
        case "X":
          inc = 3;
          break;
      }
      step += inc;
      steps.push(step);
    }
    return steps;
  }

  generateTriads(offset: number): ReadonlyArray<IntervalType> {
    // this is ionian, each mode bumps up one offset.
    let base = "maj min min maj maj min dim".split(" ");
    const triads: ReadonlyArray<IntervalType> = base.map((a, i) => {
      return <IntervalType>base[(i + offset) % base.length];
    });
    return triads;
  }

  static get params() {
    return {
      aeolian: {
        steps: "WHWWHWW",
        dominance: "3010201",
        name: "Aeolian (Nat. Minor)",
        triadOffset: 5
      },
      dorian: {
        steps: "WHWWWHW",
        dominance: "3010221",
        name: "Dorian",
        triadOffset: 1
      },
      ionian: {
        steps: "WWHWWWH",
        dominance: "3010201",
        name: "Ionian (Major)",
        triadOffset: 0
      },
      locrian: {
        steps: "HWWHWWW",
        dominance: "3010300",
        name: "Locrian",
        triadOffset: 6
      },
      lydian: {
        steps: "WWWHWWH",
        dominance: "3012201",
        name: "Lydian",
        triadOffset: 3
      },
      melodic: {
        steps: "WHWWWWH",
        dominance: "3010300",
        name: "Minor (Melodic)",
        triads: "min min aug maj maj dim dim"
          .split(" ")
          .map(a => <IntervalType>a)
      },
      harmonic: {
        steps: "WHWWHXH",
        dominance: "3010300",
        name: "Minor (Harmonic)",
        triads: "min dim aug min maj maj dim"
          .split(" ")
          .map(a => <IntervalType>a)
      },
      mixolydian: {
        steps: "WWHWWHW",
        dominance: "3010202",
        name: "Mixolydian",
        triadOffset: 4
      },
      phrygian: {
        steps: "HWWWHWW",
        dominance: "3210201",
        name: "Phrygian",
        triadOffset: 2
      }
    };
  }
}
