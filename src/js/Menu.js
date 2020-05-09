import Elem from './utils/Elem';

export default class Menu {
  constructor() {
    this.active = false;
    this.pointMenu = 0;
  }

  init() {
    this.render();
  }

  render() {
    const DELAY = 500;
    Elem('div', '.menu__burger', Elem('div')).parent('.header .wrapper')
      .on('click', (event) => {
        this.activateMenu();
        event.stopPropagation();
      });
    const list = [
      Elem('li', '.menu__item .item-active', 'All'),
      Elem('li', '.menu__item', 'Movie'),
      Elem('li', '.menu__item', 'Series'),
      Elem('li', '.menu__item', 'Game'),
    ];
    Elem('ul', '.menu', list).parent('.header .wrapper');
    document.addEventListener('click', (event) => {
      if (this.active && !event.target.classList.contains('menu')) {
        if (event.target.classList.contains('menu__item')) {
          this.changePointMenu(event.target);
        }
        setTimeout(() => {
          this.activateMenu(false);
        }, DELAY);
      }
    });
  }

  activateMenu(mark = !this.active) {
    Elem('.menu__burger').cls(`${mark ? '.' : '_'}burger-active`);
    Elem('.menu').cls(`${mark ? '.' : '_'}menu-active`);
    this.active = mark;
  }

  changePointMenu(objElement) {
    document.querySelectorAll('.menu__item').forEach((item, i) => {
      if (item === objElement) {
        this.pointMenu = i;
        item.classList.add('item-active');
      } else {
        item.classList.remove('item-active');
      }
    });
  }
}
