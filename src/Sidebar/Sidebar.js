import React from "react";
import "./Sidebar.css";
import Card from "../Card/Card";
import { Recipe } from "../models";

class Sidebar extends React.Component {
	render() {
		return (
			<div className="sidebar">
				<Card recipe={new Recipe("hello", "hello", "hello", "hello", "hello")}></Card>
				<Card recipe={new Recipe("hello", "hello", "hello", "hello", "hello")}></Card>
			</div>
		);
	}
}

export default Sidebar;
