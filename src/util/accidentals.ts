export default function accidentals(text: string) {
  const flat = "♭";
  const sharp = "♯";
  return text.replace(/b/g, flat).replace(/#/g, sharp);
}
