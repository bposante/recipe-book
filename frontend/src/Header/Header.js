import React from "react";
import "./Header.css";

class Header extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="header">
				Header
				<button onClick={this.props.addRecipe}>Add Recipe</button>
			</div>
		);
	}
}

export default Header;
