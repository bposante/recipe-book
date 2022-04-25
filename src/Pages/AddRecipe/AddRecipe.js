import React from "react";
import "./AddRecipe.css";
import Recipe from "../../models";
import { Service } from "../../Service";

class AddRecipe extends React.Component {
	service;

	constructor(props) {
		super(props);
		this.state = { name: "", ingredients: "", instructions: "", picture: "", time: "" };

		this.handleName = this.handleName.bind(this);
		this.handleIngredients = this.handleIngredients.bind(this);
		this.handleInstructions = this.handleInstructions.bind(this);
		this.handlePicture = this.handlePicture.bind(this);
		this.handleTime = this.handleTime.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleName(event) {
		this.setState({ name: event.target.value });
	}

	handleIngredients(event) {
		this.setState({ ingredients: event.target.value });
	}

	handleInstructions(event) {
		this.setState({ instructions: event.target.value });
	}

	handlePicture(event) {
		this.setState({ picture: event.target.value });
	}

	handleTime(event) {
		this.setState({ time: event.target.value });
	}

	handleSubmit(event) {
		event.preventDefault();
		this.props.addRecipe(
			new Recipe(
				this.state.name,
				this.state.ingredients,
				this.state.instructions,
				this.state.picture,
				this.state.time
			)
		);
	}

	render() {
		return (
			<div className="recipe-form">
				<form onSubmit={this.handleSubmit}>
					<label>
						Name:
						<input type={"text"} value={this.state.name} onChange={this.handleName}></input>
					</label>
					<label>
						Ingredients:
						<input type={"text"} value={this.state.ingredients} onChange={this.handleIngredients}></input>
					</label>
					<label>
						Instructions:
						<input
							type={"textbox"}
							value={this.state.instructions}
							onChange={this.handleInstructions}
						></input>
					</label>
					<label>
						Picture:
						<input type={"text"} value={this.state.picture} onChange={this.handlePicture}></input>
					</label>
					<label>
						Time:
						<input type={"number"} value={this.state.time} onChange={this.handleTime}></input>
					</label>
					<input type={"submit"} value="Submit"></input>
				</form>
			</div>
		);
	}
}

export default AddRecipe;
