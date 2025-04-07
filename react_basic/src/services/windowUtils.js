const windowUtils = {
  toggleWindowScroll(flag) {
    document.body.style.overflow = flag ? 'auto' : 'hidden';
  },

  scrollDown() {
    window.scrollTo({ top: document.body.scrollHeight });
  },
};

export default windowUtils;
