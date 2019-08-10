// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';


/** Global state of the app
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/
const state = {};

//----------------------SEARCH CONTROLLER--------------------------
const controlSearch = async () => {

	// 1. Get query from view
	const query = searchView.getInput();

	if (query) {
		// 2. new search object and add to state
		state.search = new Search(query);

		// 3. prepare UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);

		try {
			// 4. search for recipes
			await state.search.getResults();

			// 5. Render results on UI
			clearLoader();
			searchView.renderResults(state.search.result);	
		} catch (e) {
			alert('Something went wrong with the search');
			clearLoader();
		}		

	}

};

//----------------------RECIPE CONTROLLER--------------------------

const controlRecipe = async () => {
	// get ID from url
	const id = window.location.hash.replace('#', '');

	if (id) {
		// prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		// highlight selected search item
		if (state.search) searchView.highlightSelected(id);

		// create new recipe object
		state.recipe = new Recipe(id);

		try {
			// get recipe data and parse ingredients
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();

			//call calcTime and calcServings
			state.recipe.calcTime();
			state.recipe.calcServings();

			// render recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe);
			
		} catch (err) {
			console.log(err);
			alert('Error processing recipe');
		}

	}
};

//--------------------EVENT LISTENERS-------------------------------

elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
	const btn = e.target.closest('.btn-inline');
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
	}
});

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
