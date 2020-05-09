import { KEY_OMDB, URL_OMDB } from './contants';
import message from './message';

export default function getCardsApi({ title, id, page }) {
  let url;
  if (id) {
    url = `${URL_OMDB}?apikey=${KEY_OMDB}&i=${id}`;
  } else {
    const mode = ['', 'movie', 'series', 'game'];
    const addPage = page ? `&page=${page}` : '';
    let modeMovie = '';
    if (window.app.menu.pointMenu) {
      modeMovie = `&type=${mode[window.app.menu.pointMenu]}`;
    }
    url = `${URL_OMDB}?apikey=${KEY_OMDB}&s=${title.replace(' ', '+')}${addPage}${modeMovie}`;
  }
  return (fetch(url)
    .then((res) => {
      if (!res.ok) {
        return Promise.reject(res);
      }
      return res.json();
    }))
    .catch((error) => {
      const err = error instanceof Error ? error.message : error;
      const text = title || id;
      message(err, ` searching movie "${text}" `);
      return Promise.reject();
    });
}
