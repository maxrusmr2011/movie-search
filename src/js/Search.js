import Elem from './Elem';
import { KEY_Y, URL_Y } from './contants';

export default class Search {
  constructor() {
    this.inputText = '';
  }

  init() {
    this.render();
  }

  render() {
    const iconSearch = Elem('span', '.search__icon', 'S');
    this.input = Elem('input', '.search__input').on('change', this.handleInput);
    const clear = Elem('button', '.search__clear', '✖');
    const content = Elem('div', '.search__content', [iconSearch, this.input, clear]);
    const start = Elem('button', '.search__start', 'Search').on('click', this.handleInput);
    const wrapper = Elem('div', '.wrapper', [content, start]);
    Elem('div', '.search', wrapper).parent('.main');
  }

  handleInput() {
    this.inputText = this.input.value.toLowCase();
    if (this.isRussianSentence()) {
      this.translateSentence()
        .then((res) => {
          this.inputText = res;
          this.findMovies();
        });
    } else {
      this.findMovies();
    }
  }

  static isRussian(text) {
    return text.every((letter) => letter >= 'а' && letter <= 'я');
  }

  isRussianSentence() {
    const arrWords = this.inputText.split(' ');
    const indexRu = arrWords.findIndex((item) => Search.isRussian(item));
    return indexRu >= 0;
  }

  translateSentence() {
    const arrWords = this.inputText.split(' ');
    const arrIndexTranslate = arrWords
      .map((item, i) => (Search.isRussian(item) ? i : -1))
      .filter((it) => it >= 0);
    const arrPromiseTranslate = arrIndexTranslate
      .map((item) => Search.translateFetch(item));
    return Promise.all(arrPromiseTranslate)
      .then((arrRes) => {
        arrRes.forEach((item, i) => {
          arrWords[arrIndexTranslate[i]] = item;
        });
        return arrWords.join(' ');
      });
  }

  static translateFetch(text) {
    const url = `${URL_Y}?key=${KEY_Y}&lang=ru-en&text=${text}`;
    return (fetch(url)
      .then((res) => res.json())
      .then((res) => Promise.resolve(res.text[0])));
  }
}
