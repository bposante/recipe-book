import React from "react";
import "./ShowRecipe.css";

export class ShowRecipe extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="selected-recipe">
				<div>{this.props.recipe.name}</div>
				<div>{this.props.recipe.ingredients}</div>
				<div>{this.props.recipe.instructions}</div>
				<div>{this.props.recipe.picture}</div>
				<div>{this.props.recipe.time}</div>
			</div>
		);
	}
}