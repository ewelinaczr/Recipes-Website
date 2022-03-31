// Import parent Class
import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  parentEl = document.querySelector('.bookmarks__list');
  errorMessage = 'No bookmarks yet.';
  successMessage = '';

  addHandlerRenderBookmarks(handler) {
    window.addEventListener('load', handler);
  }

  generateMarkup() {
    return (
      this.data
        // return markup string
        .map(bookmark => previewView.render(bookmark, false))
        .join('')
    );
  }
}

export default new BookmarksView();
