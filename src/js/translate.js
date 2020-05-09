import { KEY_Y, URL_Y } from './contants';
import message from './message';

export default function translate(text) {
  const url = `${URL_Y}?key=${KEY_Y}&lang=ru-en&text=${text}`;
  return (fetch(url)
    .then((res) => {
      console.log('ответ0', res);
      if (!res.ok) {
        return Promise.reject(res);
      }
      return res.json();
    })
    .then((res) => Promise.resolve(res.text[0])))
    .catch((error) => {
      console.log('отве1', error, error.message);
      const err = error instanceof Error ? error.message : error;
      message(err, ` translate "${text}" `);
      return Promise.reject();
    });
  // return Promise.resolve('port')
}
