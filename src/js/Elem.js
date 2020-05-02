export default function Elem(...arg) {
  // ['a'/objEl, '.class', objEl/arrEl/'<img>'/'text']
  if (!new.target) return new Elem(...arg);
  const [nameElem, classStr, content] = arg;
  if (typeof nameElem === 'string') {
    if (nameElem[0] === '.') {
      this.native = document.querySelector(nameElem);
    } else {
      this.native = document.createElement(nameElem);
    }
  } else {
    this.native = nameElem;
  }
  if (classStr) {
    let arrClass = classStr.split(' ');
    arrClass = arrClass.map((item) => item.slice(1));
    this.native.classList.add(...arrClass);
  }
  if (content) {
    if (typeof content === 'string') {
      this.native.innerHTML = content;
    } else if (Array.isArray(content)) {
      content.forEach((item) => {
        this.native.append(item.native ? item.native : item);
      });
    } else {
      this.native.append(content.native ? content.native : content);
    }
  }
}

Elem.prototype.attr = function attr(arrAttr) {
  arrAttr.forEach(([attrKey, attrValue]) => {
    this.native.setAttribute(attrKey, attrValue);
  });
  return this;
};

Elem.prototype.prop = function prop(arrProp) {
  arrProp.forEach(([propKey, propValue]) => {
    this.native[propKey] = propValue;
  });
  return this;
};

Elem.prototype.on = function on(nameEvent, fn) {
  this.native.addEventListener(nameEvent, fn);
  return this;
};

Elem.prototype.cls = function cls(classStr) {
  const arrClass = classStr.split(' ');
  arrClass.forEach((item) => {
    if (item[0] === '.') {
      this.native.classList.add(item.slice(1));
    } else {
      this.native.classList.remove(item.slice(1));
    }
  });
  return this;
};

Elem.prototype.parent = function parent(queryStr) {
  document.querySelector(queryStr).append(this.native);
  return this;
};

Elem.prototype.child = function parent(content) {
  if (content) {
    if (typeof content === 'string') {
      this.native.innerHTML = content;
    } else if (Array.isArray(content)) {
      content.forEach((item) => {
        this.native.append(item.native ? item.native : item);
      });
    } else {
      this.native.append(content.native ? content.native : content);
    }
  }
  return this;
};
