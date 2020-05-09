import Elem from '../utils/Elem';

export default class Key {
  constructor({
    form,
    code,
    small,
    shift,
  }, objKeyboard) {
    this.code = code;
    this.small = small;
    this.shift = shift;
    this.form = form;
    this.objKeyboard = objKeyboard;
  }

  elementKey() {
    const innerKey = Elem('div', false, this.getLetter());
    const oneKey = Elem('div', `.keyboard__key .key-${this.form}`, innerKey)
      .prop([['referenceKey', this]]);
    this.innerKey = innerKey;
    return oneKey;
  }

  changeKey() {
    this.innerKey.child(this.getLetter());
  }

  getLetter() {
    let letter;
    switch (this.form) {
      case 'small':
        if (this.objKeyboard.fn.shift) {
          letter = this.shift || this.small.toUpperCase();
        } else if (this.objKeyboard.fn.capsLock && !this.shift) {
          letter = this.small.toUpperCase();
        } else {
          letter = this.small;
        }
        break;
      case 'lang':
        letter = this.objKeyboard.listLang[this.objKeyboard.currentLangNum];
        break;
      default:
        letter = this.small;
    }
    return letter;
  }
}
