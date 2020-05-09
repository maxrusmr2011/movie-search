import Elem from './utils/Elem';
import translate from './translate';
import Keyboard from './keyboard/Keyboard';

// import message from './message';
// import getCardsApi from './omdb';

export default class Search {
  constructor() {
    this.inputText = '';
  }

  init() {
    this.render();
    this.keyboard = new Keyboard(this.input);
    this.keyboard.init();
  }

  render() {
    const iconSearch = Elem('img', '.search__icon')
      .prop([['src', './src/assets/img/search.png'], ['alt', 'search']]);
    this.input = Elem('input', '.search__input')
      .attr([['placeholder', 'Search movie...']])
      .on('keydown', (event) => {
        if (event.code === 'Enter') {
          // Search.handleInput();
          console.log('enter this', this);
          
          this.handleInput();
        }
      }).native;
    const label = Elem('label', false, [iconSearch, this.input]);
    const clear = Elem('button', '.search__clear', '✖')
      .on('click', () => {
        this.input.value = '';
        this.inputText = '';
        this.input.focus();
      });
    const keybImg = Elem('img')
      .prop([['src', './src/assets/img/keyboard.png'], ['alt', 'keyb']])
      .on('click', () => {
        Elem('.keyboard', '.keyboard-active');
      });
    const keyboard = Elem('button', '.search__keyboard', keybImg);
    const content = Elem('div', '.search__content', [label, clear, keyboard]);
    const start = Elem('button', '.search__start', 'Search')
      .on('click', () => {
        this.handleInput();
      });
    const wrapper = Elem('div', '.wrapper', [content, start]);
    Elem('div', '.search', wrapper).parent('.main');
    document.addEventListener('keydown', () => {
      this.input.focus();
    });
  }

  handleInput() {
    // const self = window.app.search;
    console.log('value=', this);
    if (this.input.value) {
      this.inputText = this.input.value.toLowerCase();
      if (this.isRussianSentence()) {
        this.translateSentence()
          .then((res) => {
            this.inputText = res;
            this.input.value = res;
            window.app.listCards.findMovies();
          })
          .catch((error) => {
          //   console.log('do not translate');
          });
      } else {
        window.app.listCards.findMovies();
      }
    }
  }

  static handleInput1() {
    const self = window.app.search;
    console.log('value=', self.input.value);
    if (self.input.value) {
      self.inputText = self.input.value.toLowerCase();
      if (self.isRussianSentence()) {
        self.translateSentence()
          .then((res) => {
            self.inputText = res;
            self.input.value = res;
            window.app.listCards.findMovies();
          })
          .catch((error) => {
          //   console.log('do not translate');
          });
      } else {
        window.app.listCards.findMovies();
      }
    }
  }

  static isRussian(text) {
    const LETTER_RU = { first: 'а', last: 'я' };
    return text.split('').every((letter) => letter >= LETTER_RU.first && letter <= LETTER_RU.last);
    // return text.split('').every((letter) => letter >= 'а' && letter <= 'я');
  }

  isRussianSentence() {
    const arrWords = this.inputText.split(' ');
    const indexRu = arrWords.findIndex((item) => {
      const a = Search.isRussian(item);
      console.log('is Rus1=', a);
      return a;
    });
    console.log('rus N=', indexRu);
    
    return indexRu >= 0;
  }

  translateSentence() {
    const arrWords = this.inputText.split(' ');
    const arrIndexTranslate = arrWords
      .map((item, i) => (Search.isRussian(item) ? i : -1))
      .filter((it) => it >= 0);
    const arrPromiseTranslate = arrIndexTranslate
      .map((item) => translate(arrWords[item]));

    return Promise.all(arrPromiseTranslate)
      .then((arrRes) => {
        arrRes.forEach((item, i) => {
          arrWords[arrIndexTranslate[i]] = item;
        });
        return arrWords.join(' ');
      });
  }
}
