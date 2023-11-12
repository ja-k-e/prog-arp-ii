import Composition from "./components/composer/Composition";
import Controller from "./components/controller/Controller";
import { MIDI, MIDIEvent } from "./components/controller/MIDI";
import Keyboard from "./components/dom/Keyboard";
import Arp from "./components/dom/Arp";
import Form from "./components/dom/Form";
import { Intervals } from "./components/dom/Intervals";
import { RootType, ModeType } from "./types/index";
import accidentals from "./util/accidentals";

console.clear();

const { context, Gain, AMSynth, FMSynth, Transport } = window.Tone;
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

document.documentElement.addEventListener("mousedown", () => {
  if (context.state !== "running") context.resume();
});

const composition = new Composition("F#", "locrian");
const keyboard = new Keyboard(document.getElementById("keyboard"), composition);
const controller = new Controller();
const intervals = new Intervals(
  document.getElementById("intervals"),
  composition,
  controller
);
const form = new Form(
  document.getElementById("options"),
  composition,
  controller
);
const arp = new Arp(document.getElementById("arp"));

controller.register("updateInterval", updateInterval);
controller.register("updateScale", updateScale);

const $title = document.getElementById("title");
const $tempo: HTMLInputElement = document.getElementById(
  "tempo"
) as HTMLInputElement;
const $clear = document.getElementById("clear");
const $random = document.getElementById("random");
$clear.addEventListener("click", () => arp.clear());
$random.addEventListener("click", () => arp.random());
$title.addEventListener("click", () => form.toggle());
updateTitle();

let initialized = false;
let currentInterval = 0;
let last: number | null = null;
let leadOn = false;
let noteIdx = 0;
let lead1: typeof AMSynth | undefined;
let lead2: typeof AMSynth | undefined;

const midi = new MIDI(onMidiEvent);
midi.initialize().then(() => console.log("MIDI Initialized"));

function updateScale(root: RootType, mode: ModeType): void {
  composition.updateScale(root, mode);
  keyboard.updateScale();
  updateTitle();
  intervals.handleActiveKeyChange(composition.intervals);
}

function updateTitle() {
  const { scale, root } = composition;
  const { name, nameAlt } = root;
  const n = name !== nameAlt ? `${name} / ${nameAlt}` : name;
  $title.innerHTML = `${accidentals(n)} ${scale.name}`;
}

function updateInterval(interval: number): void {
  if (!initialized) initialize();
  if (last === null) {
    Transport.start();
    last = interval;
    lead1.triggerRelease();
    lead2.triggerRelease();
    leadOn = false;
  } else if (interval === last) {
    Transport.stop();
    setTimeout(clear, 50);
    last = null;
    lead1.triggerRelease();
    lead2.triggerRelease();
    leadOn = false;
  } else {
    last = interval;
    lead2Update();
  }
  currentInterval = interval;
  intervals.handleActiveIntervalChange(currentInterval);
}

document.addEventListener("keydown", (e) => {
  const target = e.target as HTMLElement;
  if (target.tagName && target.tagName === "INPUT") return;
  const match = e.code.match(/Digit([1-7])/);
  if (match) updateInterval(parseInt(match[1]) - 1);
});

function clear() {
  keyboard.clear();
  intervals.clear();
}

function initialize() {
  const synths = [
    new AMSynth({ oscillator: { type: "triangle4" } }),
    new AMSynth({ oscillator: { type: "triangle4" } }),
    new AMSynth({ oscillator: { type: "triangle4" } }),
    new AMSynth({ oscillator: { type: "sawtooth4" } }),
  ];
  const channels = [
    new Gain(0.2),
    new Gain(0.2),
    new Gain(0.2),
    new Gain(0.85),
  ];
  const output = new Gain();
  lead1 = new AMSynth();
  lead2 = new AMSynth();
  lead1.set({ oscillator: { type: "sawtooth4" }, portamento: 0.5 });
  lead2.set({ oscillator: { type: "sawtooth4" }, portamento: 0.6 });
  const lead1Gain = new Gain(0.3);
  const lead2Gain = new Gain(0.3);
  lead1.connect(lead1Gain);
  lead2.connect(lead2Gain);
  lead1Gain.connect(output);
  lead2Gain.connect(output);
  synths.forEach((synth, i) => {
    synth.connect(channels[i]);
    channels[i].connect(output);
  });
  output.toDestination();
  updateTempo();
  Transport.scheduleRepeat((time: string) => {
    const interval = composition.intervals[currentInterval];
    const notes = arp.tick(interval);
    keyboard.tick(interval.triad.notes);
    notes.forEach((note, i) => {
      if (note) synths[i].triggerAttackRelease(note, "16n", time);
    });
  }, "16n");
  $tempo.addEventListener("input", updateTempo);

  initialized = true;
}

function onMidiEvent({ type, a, b }: MIDIEvent) {
  if (type === "note_on") {
    const { value: noteNum } = a;
    if (noteNum >= 36 && noteNum <= 42) {
      updateInterval(noteNum - 36);
    } else if (lead1 && noteNum >= 48 && noteNum <= 74) {
      const index = noteNum - 48;
      noteIdx = index % 12;
      const note = notes[noteIdx];
      const octave = 3 + Math.floor(index / 12);
      lead2Update();
      if (leadOn) {
        lead1.setNote(`${note}${octave}`);
      } else {
        leadOn = true;
        lead1.triggerAttack(`${note}${octave}`);
      }
    }
  }
}

function lead2Update() {
  const index = composition.intervals[currentInterval].triad.notes
    .map(({ note: { name } }) => {
      const i = notes.indexOf(name);
      return [i, Math.abs(noteIdx - i)];
    })
    .sort((a, b) => b[1] - a[1])[0][0];
  const note = notes[index];
  const octave = 3;
  if (leadOn) {
    lead2.setNote(`${note}${octave}`);
  } else {
    lead2.triggerAttack(`${note}${octave}`);
  }
}

function updateTempo() {
  Transport.bpm.value = parseInt($tempo.value) || 100;
}
