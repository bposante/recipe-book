import React from "react";
import "./Card.css";

class Card extends React.Component {
	constructor(props) {
		super(props);
		this.selectRecipe = this.selectRecipe.bind(this);
	}

	selectRecipe() {
		this.props.selectRecipe(this.props.recipe);
		this.props.showRecipe();
	}

	render() {
		return (
			<div className="card-component" onClick={this.selectRecipe}>
				<div>{this.props.recipe.name}</div>
				<div>{this.props.recipe.ingredients}</div>
				<div>{this.props.recipe.picture}</div>
				<div>{this.props.recipe.time}</div>
			</div>
		);
	}
}

export default Card;
