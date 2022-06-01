export class Recipe {
	constructor(name, ingredients, instructions, picture, time, description, servings) {
		this.name = name;
		this.ingredients = ingredients;
		this.instructions = instructions;
		this.picture = picture;
		this.time = time;
		this.description = description;
		this.servings = servings;
	}
}

export default Recipe;
