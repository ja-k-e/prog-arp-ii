import Composition from "./components/composer/Composition";
import Controller from "./components/controller/Controller";
import Keyboard from "./components/dom/Keyboard";
import Arp from "./components/dom/Arp";
import Form from "./components/dom/Form";
import { Intervals } from "./components/dom/Intervals";
import { RootType, ModeType } from "./types/index";
import accidentals from "./util/accidentals";

const { context, Gain, Synth, Transport } = window.Tone;
console.clear();

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
  } else if (interval === last) {
    Transport.stop();
    setTimeout(clear, 50);
    last = null;
  } else last = interval;
  currentInterval = interval;
  intervals.handleActiveIntervalChange(currentInterval);
}

document.addEventListener("keydown", e => {
  const target = e.target as HTMLElement;
  if (target.tagName && target.tagName === "INPUT") return;
  const code = e.keyCode;
  if (code <= 55 && code >= 49) updateInterval(code - 49);
});

function clear() {
  keyboard.clear();
  intervals.clear();
}

function initialize() {
  const synths = [
    new Synth({ oscillator: { type: "sine4" } }),
    new Synth({ oscillator: { type: "sine4" } }),
    new Synth({ oscillator: { type: "sine4" } }),
    new Synth({ oscillator: { type: "sawtooth8" } })
  ];
  const channels = [
    new Gain(0.15),
    new Gain(0.15),
    new Gain(0.15),
    new Gain(0.6)
  ];
  const output = new Gain();
  synths.forEach((synth, i) => {
    synth.connect(channels[i]);
    channels[i].connect(output);
  });
  output.toMaster();
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

function updateTempo() {
  Transport.bpm.value = parseInt($tempo.value) || 100;
}
