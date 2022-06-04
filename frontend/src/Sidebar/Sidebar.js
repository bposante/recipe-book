import React from "react"
import "./Sidebar.css"
import RecipeCard from "../Card/Card"

export const Sidebar = (props) => {
  return (
    <div className="sidebar">
      {props.recipes.map((recipe, i) => (
        <RecipeCard recipe={recipe} key={i} selectRecipe={props.selectRecipe} showRecipe={props.showRecipe} />
      ))}
    </div>
  )
}

export default Sidebar
