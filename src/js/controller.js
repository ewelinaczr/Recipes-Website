// Icons import from prior folder
import icons from 'url:../img/icons.svg';
console.log(icons);

// Adjusting to older browsers
import 'core-js/stable';
import 'regenerator-runtime';

// Import modules
import * as model from './model.js';
import RecipeView from './Views/recipeView';
import { async } from 'regenerator-runtime';
import SearchView from './Views/searchView';
import ResultsView from './Views/resultsView';
import PaginationView from './Views/paginationView';
import paginationView from './Views/paginationView';
import resultsView from './Views/resultsView';
import recipeView from './Views/recipeView';
import BookmarksView from './Views/bookmarksView';
import AddRecipeView from './Views/addRecipeView';
import addRecipeView from './Views/addRecipeView';
import { MODAL_CLOSE_SECONDS } from './config.js';
import bookmarksView from './Views/bookmarksView';

// Reloads the modules that changed without refreshing the whole website
// if (module.hot) {
//   module.hot.accept();
// }

// API website
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// Load & render single recipe after choosing form list
const controlRecipes = async function () {
  try {
    // Setting ID change / taking from clicked url
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return;

    // Render spinner
    RecipeView.renderSpinner();

    //Update results view to mark selected search result - add selected class
    resultsView.update(model.getSearchResultsPage());
    //Update bookmarks view to mark selected search result - add selected class
    BookmarksView.update(model.state.bookmarks);

    // Loading recipe - return as promise from async function - from Model
    await model.loadRecipe(id);
    const { recipe } = model.state;
    //Rendering recipe - with RecipeView
    RecipeView.render(model.state.recipe);
  } catch (err) {
    alert(err);
    RecipeView.renderError();
  }
};

// Load & render search results by query
const controlSearchResults = async function () {
  try {
    // Set query from searchView
    const query = SearchView.getQuerry();
    if (!query) return;
    // Clear input
    SearchView.clearInput();
    // Load search results form model
    await model.loadSearchResults(query);
    // Display spinner
    ResultsView.renderSpinner();
    // Render search results with ResultsView
    ResultsView.render(model.getSearchResultsPage());
    // Render pagination buttons
    PaginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

//Displey next/privious page
const controlPagination = function (gotoPage) {
  // Render new results
  ResultsView.render(model.getSearchResultsPage(gotoPage));
  // Render new pagination buttons
  PaginationView.render(model.state.search);
};

// Increase / decrease servings
const controlServings = function (newServings) {
  // Update recipe servings (in state)
  model.updateServings(newServings);

  // Update the RecipeView
  RecipeView.update(model.state.recipe);
};

// Add/delete new bookmark
const controlAddBookmark = function () {
  // if it's not bookmarked yet - add bookmark
  // console.log(!model.state.recipe.bookmarked);
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // else delete bookmark
  else model.deleteBookmark(model.state.recipe.id);
  // Update recipe View with bookmark
  recipeView.update(model.state.recipe);
  console.log(model.state.recipe);
  // Render bookmarks
  BookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  BookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render loading spinner
    addRecipeView.renderSpinner();
    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // Render new recipe
    RecipeView.render(model.state.recipe);
    // Display success message
    addRecipeView.renderSuccessMsg();
    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    // Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toogleWindow();
    });
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};

// Publisher-subscriber pattern to init View events
const init = function () {
  BookmarksView.addHandlerRenderBookmarks(controlBookmarks);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  AddRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
