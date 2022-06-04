import React from "react"
import "./App.css"
import Header from "./Header/Header"
import Sidebar from "./Sidebar/Sidebar"
import AddRecipe from "./Pages/AddRecipe/AddRecipe"
import { ShowRecipe } from "./Pages/ShowRecipe/ShowRecipe"
import Recipe from "./models"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: "default",
      recipes: [],
      api: {},
      currentRecipe: null
    }
    this.getRecipes = this.getRecipes.bind(this)
    this.addRecipe = this.addRecipe.bind(this)
    this.selectRecipe = this.selectRecipe.bind(this)
    this.hitApi = this.hitApi.bind(this)
    this.getRecipe = this.getRecipe.bind(this)
  }

  componentDidMount() {
    this.getRecipes().then((response) => {
      this.setState({
        recipes: response
      })
    })
  }

  async addRecipe(recipe) {
    let recipes = this.state.recipes
    recipes.push(recipe)
    this.setState({
      recipes: recipes,
    })

    const formData = new FormData()
    formData.append("name", recipe["name"])
    formData.append("description", recipe["description"])
    formData.append("instructions", recipe["instructions"])
    formData.append("ingredients", JSON.stringify(recipe["ingredients"]))
    formData.append("time", recipe["time"])
    formData.append("image", recipe["image"])
    formData.append("servings", recipe["servings"])

    fetch("/addrecipe", {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    }).then(response => response.json())
    .then(result => {
      console.log(result)
    })
    .catch(error => {
      console.error('Error:', error)
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

  // TODO: fix getting recipes from db
  async getRecipes() {
    return fetch("/getrecipes")
      .then((res) => res.json())
      .then((data) => {
        let recipes = []
        data.results.forEach((recipe) => {
          // turn recipe data into recipe object
          let obj = new Recipe(
            recipe[2],
            null,
            recipe[8],
            recipe[9],
            recipe[3],
            recipe[7],
            recipe[5]
          )
          recipes.push(obj)
        })
        return recipes
      })
    
  }

  selectRecipe(recipe) {
    this.setState({currentRecipe: recipe})
  }

  async getRecipe(recipe) {
    return fetch(`/getrecipe?recipe=${recipe.name}`)
    .then((response) => {response.json()})
    .then((data) => {return data})
  }


  render() {
    return (
      <div>
        <Header addRecipe={() => this.setState({ page: "add recipe" })} />
        <Grid
          className="app-body"
          page={this.state.page}
          recipes={this.state.recipes}
          addRecipe={this.addRecipe}
          getRecipes={this.getRecipes}
          selectRecipe={this.selectRecipe}
          currentRecipe={this.state.currentRecipe}
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
          recipes={this.props.recipes}
          selectRecipe={this.props.selectRecipe}
          showRecipe={this.props.showRecipe}
        ></Sidebar>
        {this.renderPage()}
      </div>
    )
  }
}
