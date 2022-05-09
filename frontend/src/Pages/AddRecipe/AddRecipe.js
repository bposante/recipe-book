import React from "react"
import "./AddRecipe.css"
import Recipe from "../../models"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto"
import { Typography } from "@mui/material"

class AddRecipe extends React.Component {

  constructor(props) {
    super(props)
    this.state = { name: "", ingredients: "", instructions: "", picture: "", time: "", description: "" }

    this.handleName = this.handleName.bind(this)
    this.handleIngredients = this.handleIngredients.bind(this)
    this.handleInstructions = this.handleInstructions.bind(this)
    this.handlePicture = this.handlePicture.bind(this)
    this.handleTime = this.handleTime.bind(this)
    this.handleDescription = this.handleDescription.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleName(event) {
    this.setState({ name: event.target.value })
  }

  handleIngredients(event) {
    this.setState({ ingredients: event.target.value })
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
		name: "", ingredients: "", instructions: "", picture: "", time: "", description: "" 
	})
  }

  render() {
    return (
      <div className="recipe-form">
        <form onSubmit={this.handleSubmit}>
			<Typography className="add-recipe_header" color="inherit" variant="h6">Add A Recipe</Typography>
          <div>
            <TextField className="recipe-input" label="Name" size="small" value={this.state.name} onChange={this.handleName}></TextField>
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
            <TextField
			className="recipe-input"
              label="Ingredients"
              size="small"
              value={this.state.ingredients}
              onChange={this.handleIngredients}
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
			label="Time" size="small" value={this.state.time} onChange={this.handleTime}></TextField>
          </div>
		  <div>
            <Button variant="contained" component="label">
              Add Image
              <input onChange={this.handlePicture} type="file" hidden />
			  <AddAPhotoIcon></AddAPhotoIcon>
            </Button>
            <Button variant="outlined" className="submit-recipe" onClick={this.handleSubmit}>Submit</Button>
			</div>
        </form>
      </div>
    )
  }
}

export default AddRecipe
