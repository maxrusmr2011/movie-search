import Search from './Search';
import ListCards from './ListCards';
import Menu from './Menu';

export default class App {
  constructor() {
    this.search = new Search();
    this.listCards = new ListCards();
    this.menu = new Menu();
  }

  init() {
    this.search.init();
    this.listCards.init();
    this.menu.init();

    this.search.input.value = 'Dream';
    this.search.handleInput();
    this.search.input.focus();
  }
}
