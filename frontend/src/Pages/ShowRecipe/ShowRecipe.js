import React, { useState } from "react"
import "./ShowRecipe.css"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { TextField } from "@mui/material"

export class ShowRecipe extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ingredients: [],
      open: false,
      unit: "",
      convertedUnit: "",
      openIngredient: "",
    }
    this.getRecipe = this.getRecipe.bind(this)
    this.formatInstructions = this.formatInstructions.bind(this)
    this.convertUnits = this.convertUnits.bind(this)
  }

  componentDidMount() {
    this.getRecipe(this.props.recipe).then((response) => {
      const ingredients = response.ingredients
      this.setState({ ingredients: ingredients })
    })
  }

  async getRecipe(recipe) {
    return fetch(`/getrecipe?recipe=${recipe.name}`).then((response) => {
      return response.json()
    })
  }

  formatInstructions() {
    let instructions = this.props.recipe.instructions.split(/\r?\n/)
    return (
      <div>
        <Typography gutterBottom variant="h6" color="text.secondary">
          Steps:
        </Typography>
        {instructions.map((instruction, i) => (
          <Typography variant="body1" gutterBottom key={i}>
            {instruction}
          </Typography>
        ))}
      </div>
    )
  }

  convertUnits(ingredient, targetUnit) {
    const ingArray = ingredient.split(" ")
    const sourceAmount = ingArray[0]
    const sourceUnit = ingArray[1]
    const url = `/convert?ingredientName=${ingredient.name}&sourceAmount=${sourceAmount}&sourceUnit=${sourceUnit}&targetUnit=${targetUnit}`
    return fetch(url).then((response) => {
      return response.json()
    })
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleConvert = () => {
    this.convertUnits(this.state.openIngredient, this.state.unit).then((response) => {
      this.setState({
        convertedUnit: response.response,
      })
    })
  }

  handleChange = (e) => {
    this.setState({
      unit: e.target.value,
    })
  }

  render() {
    return (
      <div className="selected-recipe">
        <Card>
          <CardMedia component="img" height="300" image={this.props.recipe.picture} alt="recipe image"></CardMedia>
          <CardContent>
            <Typography gutterBottom variant="h3" component="div">
              {this.props.recipe.name}
            </Typography>
            <Typography gutterBottom variant="h5" color="text.secondary">
              {this.props.recipe.description}
            </Typography>
            <Typography gutterBottom variant="h6">
              Total Time: {this.props.recipe.time} minutes
            </Typography>
            <Typography gutterBottom variant="h6" color="text.secondary">
              Ingredients:
            </Typography>
            {this.state.ingredients.map((ingredient, i) => (
              <div className="ingredient-container" key={i}>
                <Typography className="ingredient-entry" gutterBottom variant="body1">
                  {ingredient}
                </Typography>
                <Button
                  onClick={() => {
                    this.setState({ open: true, openIngredient: ingredient })
                  }}
                  variant="contained"
                  size="small"
                  className="convert-button"
                >
                  Convert Units
                </Button>
              </div>
            ))}
            <div>
              <Dialog open={this.state.open} onClose={this.handleClose}>
                <DialogTitle>Convert Units</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    To convert units, please type which unit you want to convert to.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="unit-convert"
                    label="Unit"
                    placeholder="Unit"
                    variant="standard"
                    onChange={this.handleChange}
                  ></TextField>
                  {this.state.convertedUnit && (
                    <Typography className="unit-answer">{this.state.convertedUnit}</Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleConvert}>Convert</Button>
                  <Button onClick={this.handleClose}>Cancel</Button>
                </DialogActions>
              </Dialog>
            </div>
            {this.formatInstructions()}
          </CardContent>
        </Card>
      </div>
    )
  }
}

export function FormConvert() {
  const [open, setOpen] = useState(false)

  return <div></div>
}
