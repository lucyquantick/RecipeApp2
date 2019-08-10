import axios from 'axios';
import { key } from '../config';

export default class Recipe {
	constructor(id) {
		this.id = id;
	}

	async getRecipe() {
		try {
			const result = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
			this.title = result.data.recipe.title;
			this.author = result.data.recipe.publisher;
			this.img = result.data.recipe.image_url;
			this.url = result.data.recipe.source_url;
			this.ingredients = result.data.recipe.ingredients;
		} catch (e) {
			console.log(e);
			alert('Something went wrong');
		}
	}

	// assuming 15 mins is required for every 3 ingredients
	calcTime() {
		const numIng = this.ingredients.length;
		const periods = Math.ceil(numIng / 3);
		this.time = period * 15;
	}

	calcServings() {
		this.servings = 4;
	}

}