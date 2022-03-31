// Import parent Class
import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  parentEl = document.querySelector('.upload');
  successMessage = 'Recipe was successfully uploaded';
  window = document.querySelector('.add-recipe-window ');
  overlay = document.querySelector('.overlay');
  buttonOpen = document.querySelector('.nav__btn--add-recipe');
  buttonClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toogleWindow() {
    this.overlay.classList.toggle('hidden');
    this.window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this.buttonOpen.addEventListener('click', this.toogleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this.buttonClose.addEventListener('click', this.toogleWindow.bind(this));
    this.overlay.addEventListener('click', this.toogleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this.parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      //   Array with all the fileds data
      const dataArray = [...new FormData(this)];
      //   Array of enries to object
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }

  generateMarkup() {}
}

export default new AddRecipeView();
