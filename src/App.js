import React from "react";
import "./App.css";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import AddRecipe from "./Pages/AddRecipe/AddRecipe";

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			page: "default",
		};
	}

	render() {
		return (
			<div>
				<Header addRecipe={() => this.setState({ page: "add recipe" })} />
				<Grid page={this.state.page}></Grid>
			</div>
		);
	}
}

export default App;

class Grid extends React.Component {
	constructor(props) {
		super(props);
	}

	renderPage() {
		switch (this.props.page) {
			case "add recipe":
				return <AddRecipe></AddRecipe>;
			default:
				return <div>default</div>;
		}
	}

	render() {
		return (
			<div className="container">
				<Sidebar></Sidebar>
				{this.renderPage()}
			</div>
		);
	}
}
