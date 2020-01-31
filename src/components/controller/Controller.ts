export default class Controller {
  methods: { [name: string]: Function };

  constructor() {
    this.methods = {};
  }

  register(name: string, callback: Function) {
    this.methods[name] = callback;
  }
}
