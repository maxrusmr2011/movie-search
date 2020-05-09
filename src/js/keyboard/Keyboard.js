import Elem from '../utils/Elem';
import * as KEY from './lang/index';
import Key from './Key';
import Search from '../Search';

export default class Keyboard {
  constructor(targetInput) {
    this.targetInput = targetInput;
    this.listLang = Object.keys(KEY);
    this.currentLangNum = 0;
    this.fn = {
      alt: false,
      ctrl: false,
      shift: false,
      capsLock: false,
    };
  }

  init() {
    this.render();
  }

  render() {
    const btn = Elem('button', '.keyboard__close', '✖').on('click', () => {
      Elem('.keyboard').cls('_keyboard-active');
    });
    Elem('div', '.keyboard', [btn, Elem('div', '.keyboard__body', this.renderKeys())])
      .on('mousedown', (e) => { this.clickKey(e); })
      .on('mouseup', (e) => { this.clickKey(e); })
      .parent('.search');
  }

  renderKeys() {
    this.listObjKey = [];
    const listRow = KEY[this.listLang[this.currentLangNum]].map((row) => {
      const listKey = row.map((key) => {
        const objKey = new Key(key, this);
        this.listObjKey.push(objKey);
        return objKey.elementKey();
      });
      return Elem('div', '.keyboard__row', listKey);
    });
    return listRow;
  }

  changeLang() {
    this.currentLangNum = (this.currentLangNum + 1) % this.listLang.length;
    Elem('.keyboard__body', false, '').child(this.renderKeys());
  }

  changeLetters() {
    this.listObjKey.forEach((item) => {
      item.changeKey(this.fn);
    });
  }

  clickKey(event) {
    const nativeKey = event.target.closest('.keyboard__key');
    if (nativeKey) {
      if (event.type === 'mousedown') {
        Elem(nativeKey).cls('.key-active');
        this.workKey(nativeKey);
      } else {
        Elem(nativeKey).cls('_key-active');
        if (nativeKey.referenceKey.code === 'ShiftLeft'
        || nativeKey.referenceKey.code === 'ShiftRight') {
          this.fn.shift = false;
          this.changeLetters();
        }
        this.targetInput.focus();
      }
    }
  }

  workKey(objKey) {
    const dir = { left: false, right: true };
    switch (objKey.referenceKey.code) {
      case 'lang': this.changeLang();
        break;
      case 'ShiftLeft':
      case 'ShiftRight': this.fn.shift = true;
        this.changeLetters();
        break;
      case 'CapsLock': this.fn.capsLock = !this.fn.capsLock;
        this.markCaps(objKey);
        this.changeLetters();
        break;
      case 'Enter':
        // Search.handleInput();
        window.app.search.handleInput();
        break;
      case 'Space':
        Keyboard.addOrDel(this.targetInput, ' ');
        break;
      case 'Tab':
        Keyboard.addOrDel(this.targetInput, '\t');
        break;
      case 'Backspace':
        Keyboard.addOrDel(this.targetInput, false);
        break;
      case 'NumpadDecimal':
      case 'Delete':
        Keyboard.addOrDel(this.targetInput, true);
        break;
      case 'Numpad4':
      case 'ArrowLeft':
        Keyboard.movePosition(this.targetInput, dir.left);
        break;
      case 'Numpad6':
      case 'ArrowRight':
        Keyboard.movePosition(this.targetInput, dir.right);
        break;
      default:
        if (objKey.referenceKey.form === 'small') {
          Keyboard.addOrDel(this.targetInput, objKey.referenceKey.getLetter());
        }
    }
  }

  markCaps(key) {
    Elem(key).cls(`${this.fn.capsLock ? '.' : '_'}caps-mark`);
  }

  static movePosition(inputElement, directionRight) {
    const input = inputElement;
    const cursorPosition = directionRight ? input.selectionStart + 1 : input.selectionStart - 1;
    input.selectionStart = cursorPosition;
    input.selectionEnd = cursorPosition;
  }

  static addOrDel(inputElement, letterOrDelete) {
    const input = inputElement;
    const { value } = input;
    let cursorPosition = input.selectionStart;
    let result;
    switch (letterOrDelete) {
      case true:
        result = `${value.slice(0, cursorPosition)}${value.slice(cursorPosition + 1)}`;
        break;
      case false:
        result = `${value.slice(0, cursorPosition - 1)}${value.slice(cursorPosition)}`;
        cursorPosition -= 1;
        break;
      default:
        result = `${value.slice(0, cursorPosition)}${letterOrDelete}${value.slice(cursorPosition)}`;
        cursorPosition += 1;
    }
    input.value = result;
    input.selectionStart = cursorPosition;
    input.selectionEnd = cursorPosition;
  }
}
