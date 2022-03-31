// Icons import from prior folder
import { mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg';

export default class View {
  parentEl;
  errorMessage;
  successMessage;
  data;

  /**
   * Render the recived object to the DOM
   * @param {Object |  Object[]} data The data to be rendered
   * @param {boolean} [render=true] If false create makup instead of renering to the dom
   * @returns (undefined | string) A markup is returned if render is false
   * @this {Object} View instance
   * @author: Ewelina Czerwińska
   * @todo Finish implementation
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this.data = data;
    const markup = this.generateMarkup();

    // return markup string
    if (!render) return markup;

    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  // not to render all makrkup but only the part that has changed
  update(data) {
    this.data = data;
    const newMarkup = this.generateMarkup();
    // Select new markup DOM Elements in array- Convert string to "dom element"
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // Select real DOM Elements in array
    const currentElements = Array.from(this.parentEl.querySelectorAll('*'));
    // Compare diffrences
    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));
      // Update changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      // Update changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  clear() {
    this.parentEl.innerHTML = '';
  }

  // Render spinner
  renderSpinner() {
    const markup = `
        <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div> 
        `;
    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  // Render error in UI
  renderError(message = this.errorMessage) {
    const markup = `
   <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  // Render success in UI
  renderSuccessMsg(message = this.successMessage) {
    const markup = `
     <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;
    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
