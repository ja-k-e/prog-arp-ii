import Note, { ROOTS } from "../composer/Note";
import { RootType, ModeType } from "../../types/index";
import Composition from "../composer/Composition";
import Controller from "../controller/Controller";
import accidentals from "../../util/accidentals";

export default class Form {
  readonly $form: HTMLElement;
  readonly composition: Composition;
  readonly controller: Controller;
  readonly $mode: HTMLSelectElement;
  readonly $root: HTMLSelectElement;
  mode: ModeType;
  open: boolean = false;
  root: RootType;

  constructor(
    form: HTMLElement,
    composition: Composition,
    controller: Controller
  ) {
    this.$form = form;
    this.$root = this.$form.querySelector("#root");
    this.$mode = this.$form.querySelector("#mode");
    this.composition = composition;
    this.controller = controller;
    this.mode = composition.mode;
    this.root = composition.root.name;
    this.loadDOM();
  }

  updateScale() {
    this.controller.methods.updateScale(this.root, this.mode);
  }

  toggle() {
    this.open = !this.open;
    this.$form.classList.toggle("open");
  }

  loadDOM() {
    ROOTS.forEach(root => {
      const $opt = document.createElement("button");
      $opt.addEventListener("click", () => {
        this.root = root;
        this.$root.querySelector(".active").classList.remove("active");
        $opt.classList.add("active");
        this.updateScale();
      });
      const extra = Note.sharpToFlat(root) || null;
      $opt.innerText = accidentals(
        extra !== root ? `${root} / ${extra}` : root
      );
      if (root === this.composition.root.name) $opt.classList.add("active");
      this.$root.appendChild($opt);
    });

    for (let key in this.composition.dictionary.scales) {
      const { name } = this.composition.dictionary.scales[<ModeType>key];
      const $opt = document.createElement("button");
      $opt.addEventListener("click", () => {
        this.mode = <ModeType>key;
        this.$mode.querySelector(".active").classList.remove("active");
        $opt.classList.add("active");
        this.updateScale();
      });
      $opt.innerText = name;
      if (key === this.composition.mode) $opt.classList.add("active");
      this.$mode.appendChild($opt);
    }
  }
}
