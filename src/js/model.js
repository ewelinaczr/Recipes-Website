// import modules
import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { getJSON } from './helpers.js';
import { sendJSON } from './helpers.js';
import { RES_PER_PAGE } from './config.js';
import { KEY } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  // Data from sigle recipe API
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // if no key nothing happen if key return key
    ...(recipe.key && { key: recipe.key }),
  };
};

// Load single recipe data
export const loadRecipe = async function (id) {
  // Loading recipe
  try {
    const data = await getJSON(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    // console.log(state.recipe);
  } catch (err) {
    console.error(`${err} 👽 `);
    throw err;
  }
};

// Search for recipes by query call from controller

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);
    // Data from sigle recipe API

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 👽 `);
    throw err;
  }
};

// Setting up pages - number of results per page
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage; //0
  const end = page * state.search.resultPerPage; //10
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // new quantity = old quantity * newServings / oldSerings
  });
  state.recipe.servings = newServings;
};

// store bookmarks in local storage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);
  // mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  // mark current recipe as nat bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

// Take data out of local storage - vivible afer reloading
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

console.log(state.bookmarks);

// Clear bookmarks
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

// Uploading new recipe -request to API - async
export const uploadRecipe = async function (newRecipe) {
  try {
    // Transform data to the same form as from API
    // Create array of ingredients -object.entries
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // console.log(ingredients);
        if (ingArr.length !== 3) throw new Error('Wrong ingredient format!');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    console.log(recipe);
    // Create a request to API
    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    // Add to recipes in same format
    state.recipe = createRecipeObject(data);
    // Add bookomark in advance
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
