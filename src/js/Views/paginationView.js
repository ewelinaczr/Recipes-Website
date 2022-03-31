// Import parent Class
import View from './View.js';

import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  parentEl = document.querySelector('.pagination');

  generateMarkup() {
    const numPages = Math.ceil(
      this.data.results.length / this.data.resultPerPage
    );
    console.log(numPages);

    // Page 1 and there are other pages
    if (this.data.page === 1 && numPages > 1)
      return `
    <button data-goto="${
      this.data.page + 1
    }" class="btn--inline pagination__btn--next">
            <span>Page ${this.data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
    `;
    // Page 1 and there are no other pages
    if (this.data.page === 1 && numPages === 1) return '';
    // Last page
    if (this.data.page === numPages)
      return `<button data-goto="${
        this.data.page - 1
      }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${this.data.page - 1}</span>
  </button>`;

    // Other page
    if (this.data.page < numPages) {
      return `<button data-goto="${
        this.data.page - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this.data.page - 1}</span>
      </button>
      <button data-goto="${
        this.data.page + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${this.data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    } else return '';
  }

  addHandlerClick(handler) {
    this.parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      console.log(gotoPage);
      handler(gotoPage);
    });
  }
}

export default new PaginationView();
