import Search from './Search';
import ListCards from './ListCards';

export default class App {
  constructor() {
    this.search = new Search();
    this.listCards = new ListCards();
  }
}
