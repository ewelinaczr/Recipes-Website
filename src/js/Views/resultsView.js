// Import parent Class
import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  parentEl = document.querySelector('.results');
  errorMessage = 'No recipes found. Try agian';
  successMessage = '';

  generateMarkup() {
    return (
      this.data
        // return markup string
        .map(result => previewView.render(result, false))
        .join('')
    );
  }
}

export default new ResultsView();
