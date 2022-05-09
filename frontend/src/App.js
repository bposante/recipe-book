import React, { useEffect } from "react"
import "./App.css"
import Header from "./Header/Header"
import Sidebar from "./Sidebar/Sidebar"
import AddRecipe from "./Pages/AddRecipe/AddRecipe"
import { ShowRecipe } from "./Pages/ShowRecipe/ShowRecipe"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: "default",
      recipes: [],
      api: {},
    }
    this.currentRecipe = null
    this.getRecipes = this.getRecipes.bind(this)
    this.addRecipe = this.addRecipe.bind(this)
    this.selectRecipe = this.selectRecipe.bind(this)
    this.hitApi = this.hitApi.bind(this)
  }

  addRecipe(recipe) {
    let recipes = this.state.recipes
    recipes.push(recipe)
    this.setState({
      recipes: recipes,
    })
  }

  hitApi() {
    fetch("/home")
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          api: data,
        })
        console.log(data)
      })
  }

  getRecipes() {
    return this.state.recipes
  }

  selectRecipe(recipe) {
    console.log("selecting recipe:", recipe)
    console.log("page:", this.state.page)
    this.currentRecipe = recipe
  }

  render() {
    return (
      <div>
        <Header addRecipe={() => this.setState({ page: "add recipe" })} />
        <Grid
          className="app-body"
          page={this.state.page}
          addRecipe={this.addRecipe}
          getRecipes={this.getRecipes}
          selectRecipe={this.selectRecipe}
          currentRecipe={this.currentRecipe}
          showRecipe={() => this.setState({ page: "show recipe" })}
        ></Grid>
      </div>
    )
  }
}

export default App

class Grid extends React.Component {
  constructor(props) {
    super(props)
  }

  renderPage() {
    switch (this.props.page) {
      case "add recipe":
        return <AddRecipe addRecipe={this.props.addRecipe}></AddRecipe>
      case "show recipe":
        return <ShowRecipe recipe={this.props.currentRecipe}></ShowRecipe>
      default:
        return <div>default</div>
    }
  }

  render() {
    return (
      <div className="container">
        <Sidebar
          getRecipes={this.props.getRecipes}
          selectRecipe={this.props.selectRecipe}
          showRecipe={this.props.showRecipe}
        ></Sidebar>
        {this.renderPage()}
      </div>
    )
  }
}
