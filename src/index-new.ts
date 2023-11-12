import { MIDI, MIDIEvent } from "./components/controller/MIDI";

console.clear();

initialize();

async function initialize() {
  const midi = new MIDI(onMidiEvent);
  await midi.initialize();

  console.log(midi.outputs);
  const message = new Uint8Array(3);
  message[0] = 144; // - 159
  message[1] = 36;
  message[2] = 127;
  midi.notify(message, "MPK mini 3");
  function onMidiEvent(event: MIDIEvent) {
    // console.log(event.type, event);
  }
}
