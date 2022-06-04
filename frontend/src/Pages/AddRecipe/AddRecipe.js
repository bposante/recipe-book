import React from "react"
import "./AddRecipe.css"
import Recipe from "../../models"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Box from "@mui/material/Box"
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto"
import Tooltip from "@mui/material/Tooltip"
import { Typography } from "@mui/material"

class AddRecipe extends React.Component {
  constructor(props) {
    super(props)
    this.state = { name: "", ingredients: [], instructions: "", picture: "", time: "", description: "", servings: "" }

    this.handleName = this.handleName.bind(this)
    this.handleIngredients = this.handleIngredients.bind(this)
    this.handleInstructions = this.handleInstructions.bind(this)
    this.handlePicture = this.handlePicture.bind(this)
    this.handleTime = this.handleTime.bind(this)
    this.handleDescription = this.handleDescription.bind(this)
    this.handleServings = this.handleServings.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.uploadPicture = this.uploadPicture.bind(this)

    this.pictureFolder = "/home/bailey/projects/recipe-book/frontend/public"
  }

  handleName(event) {
    this.setState({ name: event.target.value })
  }

  handleIngredients(event) {
    if (event.key === "Enter" && event.target.value) {
      const ingArray = this.state.ingredients
      ingArray.push(event.target.value)
      this.setState({ ingredients: ingArray })
      const ingInput = document.getElementById("ing-recipe-input")
      ingInput.value = ""
    }
  }

  handleInstructions(event) {
    this.setState({ instructions: event.target.value })
  }

  handlePicture(event) {
    this.setState({ picture: URL.createObjectURL(event.target.files[0]) })
  }

  handleTime(event) {
    this.setState({ time: event.target.value })
  }

  handleDescription(event) {
    this.setState({ description: event.target.value })
  }

  handleServings(event) {
    this.setState({ servings: event.target.value})
  }

  handleSubmit(event) {
    // TODO: add error if submit with empty fields
    event.preventDefault()
    this.props.addRecipe(
      new Recipe(
        this.state.name,
        this.state.ingredients,
        this.state.instructions,
        this.state.picture,
        this.state.time,
        this.state.description,
        this.state.servings
      )
    )
    this.setState({
      name: "",
      ingredients: [],
      instructions: "",
      picture: "",
      time: "",
      description: "",
      servings: "",
    })
  }

  handleDelete(ingToDelete) {
    let ingArray = this.state.ingredients
    ingArray = ingArray.filter((ing) => ing !== ingToDelete)
    this.setState({
      ingredients: ingArray,
    })
    console.log(`ingredient deleted: ${ingToDelete} \ningredient array: ${this.state.ingredients}`)
  }

  uploadPicture(file) {
    const formData = new FormData()
    formData.append("file", file)
    return fetch("http://localhost:5000/uploadpicture", {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    }).then(response => response.json())
    .then(data => {console.log(data)})
  }

  render() {
    return (
      <div className="recipe-form">
        <form onSubmit={this.handleSubmit}>
          <Typography className="add-recipe_header" color="inherit" variant="h6">
            Add A Recipe
          </Typography>

          <div className="input-div">
            <Tooltip title="The recipe name." placement="right">
              <TextField
                className="recipe-input"
                label="Name"
                size="small"
                value={this.state.name}
                onChange={this.handleName}
              ></TextField>
            </Tooltip>
          </div>

          <div className="input-div">
            <Tooltip title="A short description." placement="right">
              <TextField
                className="recipe-input"
                label="Description"
                size="small"
                value={this.state.description}
                onChange={this.handleDescription}
              ></TextField>
            </Tooltip>
          </div>

          <div className="input-div">
            <Tooltip title="Number of servings this recipe makes." placement="right">
              <TextField
                className="recipe-input"
                label="Servings"
                size="small"
                type="number"
                value={this.state.servings}
                onChange={this.handleServings}
              ></TextField>
            </Tooltip>
          </div>

          <div className="input-div">
            <Tooltip title="Press enter after each listed ingredient." placement="right">
              <div className="inside-tooltip">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: "350px"
                  }}
                >
                  {this.state.ingredients.map((ingredient, i) => (
                    <Chip
                      className="ingredient-chip"
                      key={i}
                      color="primary"
                      size="small"
                      onDelete={this.handleDelete}
                      label={ingredient}
                    />
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
            </Tooltip>
          </div>

          <div className="input-div">
            <Tooltip title="Enter the recipe instructions in a numbered list with each instruction on a new line." placement="right">
              <TextField
                multiline
                rows={4}
                maxRows={8}
                className="recipe-input"
                label="Instructions"
                size="small"
                value={this.state.instructions}
                onChange={this.handleInstructions}
              ></TextField>
            </Tooltip>
          </div>

          <div className="input-div">
            <Tooltip title="Time to cook the recipe in minutes." placement="right">
              <TextField
                className="recipe-input"
                label="Time"
                size="small"
                type="number"
                value={this.state.time}
                onChange={this.handleTime}
              ></TextField>
            </Tooltip>
          </div>

          <div className="recipe-form_buttons">
            <Button variant="outlined" component="label">
              Add Image
              <input onChange={this.handlePicture} type="file" hidden />
              <AddAPhotoIcon></AddAPhotoIcon>
            </Button>
            <Button id="submit-button" variant="contained" className="submit-recipe" onClick={this.handleSubmit}>
              Submit
            </Button>
          </div>
          <div>{this.state.picture && <img className="recipe-image" src={this.state.picture} alt=""></img>}</div>
        </form>
      </div>
    )
  }
}

export default AddRecipe
