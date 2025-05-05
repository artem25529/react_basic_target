const elementUtils = {
  siblings(elem) {
    return [...elem.parentElement.children].filter((e) => e !== elem);
  },

  toggleClass(elements, className, toggle) {
    if (!elements[Symbol.iterator]) {
      elements = [elements];
    }

    const isCallback = typeof toggle === 'function';

    for (const element of elements) {
      element.classList.toggle(
        className,
        !isCallback ? toggle : toggle(element),
      );
    }
  },

  toggleHidden(elements, hide) {
    this.toggleClass(elements, 'hidden', hide);
  },
};

export default elementUtils;
