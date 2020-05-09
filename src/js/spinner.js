import Elem from './utils/Elem';

export default function spinner(end) {
  Elem('.search__icon').cls(`${end ? '_' : '.'}spinner`);
}
