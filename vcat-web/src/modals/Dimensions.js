import { makeAutoObservable } from "mobx";

class Dimensions {
  _windowWidth = "";
  _windowHeight = "";

  constructor() {
    makeAutoObservable(this);
  }

  setWindowDimensions(widthValue, heightValue) {
    this._windowWidth = widthValue;
    this._windowHeight = heightValue;
  }
}

export default new Dimensions();
