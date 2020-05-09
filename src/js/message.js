import Elem from './utils/Elem';

export default function message(str, target) {
  let strError = '';
  if (typeof str === 'string') {
    strError = `Error ${target}: ${str}`;
  } else {
    strError = `Error ${target}(${str.status}): ${str.statusText}`;
  }
  const text = Elem('div', '.message__error', strError);
  const btn = Elem('button', '.message__clear', '✖');
  const oneMessage = Elem('div', '.message', [text, btn]).parent('.page__message');
  const clear = setTimeout(() => {
    oneMessage.native.remove();
  }, 10000);
  btn.on('click', () => {
    oneMessage.native.remove();
    clearTimeout(clear);
  });
}
