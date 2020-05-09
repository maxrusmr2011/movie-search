import Elem from './utils/Elem';
import Swiper from './swiper/swiper';
import getCardsApi from './omdb';
import message from './message';
import spinner from './spinner';
import { IMGS } from './contants';

export default class ListCards {
  constructor() {
    this.listData = [];
    this.countAllCards = 0;
    this.currentPage = 1;
    this.patchImg = new Image();
    this.patchImg.src = IMGS.patch;
    this.starImg = new Image();
    this.starImg.src = IMGS.star;
  }

  init() {
    this.render();
    this.runSwiper();
    console.log(this.starImg);
  }

  runSwiper() {
    this.mySwiper = new Swiper('.swiper-container', {
      // direction: 'horizontal',
      // slidesOffsetBefore: 50,
      // slidesOffsetAfter: 50,
      loop: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        // hideOnClick: true,
      },
      scrollbar: {
        el: '.swiper-scrollbar',
      },
      slidesPerView: 1,
      spaceBetween: 20,
      slidesPerGroup: 1,
      breakpoints: {
        400: {
          slidesPerView: 2,
          spaceBetween: 50,
          slidesPerGroup: 2,
        },
        600: {
          slidesPerView: 3,
          spaceBetween: 50,
          slidesPerGroup: 3,
        },
        800: {
          slidesPerView: 4,
          spaceBetween: 50,
          slidesPerGroup: 4,
        },
      },
      on: {
        slideNextTransitionEnd: () => {
          const count = Math.ceil((this.listData.length - this.mySwiper.activeIndex)
            / this.mySwiper.params.slidesPerView);
          if (count === 2 && this.countAllCards > this.listData.length) {
            console.log('run next list', this.mySwiper.params.slidesPerView);
            this.findMovies(true);
          }
        },
      },
    });
  }

  render() {
    const list = Elem('div', '.swiper-wrapper');
    const prev = Elem('div', '.swiper-button-prev');
    const next = Elem('div', '.swiper-button-next');
    const scroll = Elem('div', '.swiper-scrollbar');
    const cont = Elem('div', '.swiper-container', [list, prev, next, scroll]);
    const swiper = Elem('div', '.page__cards .swiper', cont);
    const messagePage = Elem('div', '.page__message');
    const wrapper = Elem('div', '.wrapper', [messagePage, swiper]);
    Elem('div', '.page', wrapper).parent('.main');
    this.renderListCard([]);
  }

  renderListCard(add) {
    console.log(3, add);
    const list = add.map((item) => this.renderCard(item));
    if (this.currentPage === 1) {
      this.listData = [];
      Elem('.swiper-wrapper', false, '').child(list);
    } else {
      Elem('.swiper-wrapper', false, list);
    }
    this.listData.push(...add);
    if (this.mySwiper) {
      this.mySwiper.update();
      if (this.currentPage === 1) {
        this.mySwiper.slideTo(0);
      }
    }
  }

  static getImgSrc(imageSrc) {
    return fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => URL.createObjectURL(blob));
  }

  renderCard(info) {
    const title = Elem('div', '.card__title', info.Title);
    const img = Elem('img', '.card__img').prop([['alt', 'Poster']]);
    ListCards.getImgSrc(info.Poster)
      .then((objImgURL) => {
        img.prop([['src', objImgURL]]);
        setTimeout(() => {
          if (img.native.naturalWidth > img.native.naturalHeight) {
            img.cls('.landscape');
          }
          console.log('h=',img.native.naturalHeight, 'w=',img.native.naturalWidth);
        }, 1000);
      })
      .catch(() => {
        img.prop([['src', this.patchImg.src]]).attr([['style', 'opacity: 0.3']]);
      });
    const imgOuter = Elem('div', '.card__img-outer', img);
    const year = Elem('div', '.card__year', info.Year);
    const rate = Elem('div', '.card__rating');
    this.renderRating(info.imdbID, rate);
    return Elem('div', '.swiper-slide', [title, imgOuter, year, rate]);
  }

  renderRating(id, target) {
    getCardsApi({ id })
      .then((res) => {
        // console.log('res id =',this.starImg);
        const star = Elem('img').prop([['src', this.starImg.src], ['alt', 'star']]);
        const rate = Elem('span', false, res.imdbRating);
        Elem(target, false, [star, rate]);
      });
  }

  findMovies(nextPage) {
    spinner();
    const request = {};
    request.title = window.app.search.inputText;
    if (nextPage) {
      request.page = this.currentPage + 1;
    }
    console.log(1, request);
    getCardsApi(request)
      .then((res) => {
        if (res.Response === 'True') {
          if (nextPage) {
            this.currentPage += 1;
            // this.listData.push(...res.Search);
          } else {
            this.countAllCards = Number(res.totalResults);
            this.currentPage = 1;
            // this.listData = res.Search;
          }
          console.log(2, res);
          this.renderListCard(res.Search);
          console.log(this.listData);
        } else {
          message(res.Error, ` searching movie "${request.title}" `);
        }
        spinner(true);
      })
      .catch((error) => {
        // message(error, 'movie2');
        console.log('error findMovie');
        console.log(JSON.stringify(error));
        console.log(error);
        spinner(true);
      });
  }
}
