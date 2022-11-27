const Chroma = require("../util/chroma.js");

module.exports = class Effect {
  constructor(device, type, data, callback) {
    this.device = device;
    this.type = type;
    this.data = data;
    this.createEffect(callback);
  }

  // Apply the effect
  setEffect(callback) {
    Chroma.setEffect(this.effect, callback);
  }

  // Create the effect
  createEffect(callback) {
    if (!Chroma.isActive()) {
      return;
    }

    Chroma.createEffect(this.device, this.type, this.data).then((effect) => {
      if (!Chroma.isActive()) {
        return;
      }
      this.effect = effect;
      this.setEffect(callback);
    }).catch(console.error);
  }
};
