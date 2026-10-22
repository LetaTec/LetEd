import '@testing-library/jest-dom/vitest';

// jsdom does not implement the modal dialog API.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
  };
}

// jsdom does not implement scrolling; the router scroll handling calls it.
window.scrollTo = () => {};
Element.prototype.scrollIntoView = function scrollIntoView() {};
