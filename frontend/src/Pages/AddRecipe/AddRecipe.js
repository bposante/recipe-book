import React from "react"
import "./AddRecipe.css"
import Recipe from "../../models"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Box from "@mui/material/Box"
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto"
import { Typography } from "@mui/material"

class AddRecipe extends React.Component {
  constructor(props) {
    super(props)
    this.state = { name: "", ingredients: [], instructions: "", picture: "", time: "", description: "" }

    this.handleName = this.handleName.bind(this)
    this.handleIngredients = this.handleIngredients.bind(this)
    this.handleInstructions = this.handleInstructions.bind(this)
    this.handlePicture = this.handlePicture.bind(this)
    this.handleTime = this.handleTime.bind(this)
    this.handleDescription = this.handleDescription.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleName(event) {
    this.setState({ name: event.target.value })
  }

  handleIngredients(event) {
    if (event.key === "Enter" && event.target.value) {
      const ingArray = this.state.ingredients
      ingArray.push(event.target.value)
      this.setState({ ingredients: ingArray })
      console.log("enter pressed")
      console.log(this.state.ingredients)
      const ingInput = document.getElementById("ing-recipe-input")
      ingInput.value = ""
    }
  }

  handleInstructions(event) {
    this.setState({ instructions: event.target.value })
  }

  handlePicture(event) {
    this.setState({ picture: event.target.files[0] })
    console.log(event.target.files)
  }

  handleTime(event) {
    this.setState({ time: event.target.value })
  }

  handleDescription(event) {
    this.setState({ description: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.addRecipe(
      new Recipe(
        this.state.name,
        this.state.ingredients,
        this.state.instructions,
        this.state.picture,
        this.state.time,
        this.state.description
      )
    )
    this.setState({
      name: "",
      ingredients: [],
      instructions: "",
      picture: "",
      time: "",
      description: "",
    })
  }

  handleDelete(ingToDelete) {
    console.log(ingToDelete)
    let ingArray = this.state.ingredients
    ingArray = ingArray.filter((ing) => ing !== ingToDelete)
    this.setState({
      ingredients: ingArray,
    })
    console.log(`ingredient deleted: ${ingToDelete} \ningredient array: ${this.state.ingredients}`)
  }

  render() {
    return (
      <div className="recipe-form">
        <form onSubmit={this.handleSubmit}>
          <Typography className="add-recipe_header" color="inherit" variant="h6">
            Add A Recipe
          </Typography>

          <div>
            <TextField
              className="recipe-input"
              label="Name"
              size="small"
              value={this.state.name}
              onChange={this.handleName}
            ></TextField>
          </div>

          <div>
            <TextField
              className="recipe-input"
              label="Description"
              size="small"
              value={this.state.description}
              onChange={this.handleDescription}
            ></TextField>
          </div>

          <div>
            <Box 
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap"
            }}>
              {this.state.ingredients.map((ingredient, i) => (
                <Chip className="ingredient-chip" key={i} color="primary" size="small" onDelete={this.handleDelete} label={ingredient} />
              ))}
            </Box>
            <TextField
              className="recipe-input"
              id="ing-recipe-input"
              label="Ingredients"
              size="small"
              onKeyPress={this.handleIngredients}
            ></TextField>
          </div>

          <div>
            <TextField
              className="recipe-input"
              label="Instructions"
              size="small"
              value={this.state.instructions}
              onChange={this.handleInstructions}
            ></TextField>
          </div>

          <div>
            <TextField
              className="recipe-input"
              label="Time"
              size="small"
              value={this.state.time}
              onChange={this.handleTime}
            ></TextField>
          </div>

          <div>
            <Button variant="contained" component="label">
              Add Image
              <input onChange={this.handlePicture} type="file" hidden />
              <AddAPhotoIcon></AddAPhotoIcon>
            </Button>
            <Button variant="outlined" className="submit-recipe" onClick={this.handleSubmit}>
              Submit
            </Button>
          </div>
        </form>
      </div>
    )
  }
}

export default AddRecipe
