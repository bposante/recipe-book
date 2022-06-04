import React from "react"
import "./ShowRecipe.css"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

export class ShowRecipe extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ingredients: []
    }
    this.getRecipe = this.getRecipe.bind(this)
    this.formatInstructions = this.formatInstructions.bind(this)

  }

  componentDidMount() {
    this.getRecipe(this.props.recipe).then((response) => {
      const ingredients = response.ingredients
      this.setState({ingredients: ingredients})
      console.log(this.state.ingredients)
    })
  }

  async getRecipe(recipe) {
    return fetch(`/getrecipe?recipe=${recipe.name}`)
    .then((response) => {return response.json()})
  }

  formatInstructions() {
    console.log(this.props.recipe.instructions)
    let instructions = this.props.recipe.instructions.split(/\r?\n/)
    console.log(instructions)
    return <div>
      <Typography gutterBottom variant="h6" color="text.secondary" >Steps:</Typography>
      {instructions.map((instruction, i) => (
        <Typography variant="body1" gutterBottom key={i}>{instruction}</Typography>
      ))}
    </div>
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
            <Typography gutterBottom variant="h6" color="text.secondary">Ingredients:</Typography>
            {this.state.ingredients.map((ingredient, i) => (
              <Typography gutterBottom variant="body1" key={i}>{ingredient}</Typography>
            ))}
            {this.formatInstructions()}            
          </CardContent>
        </Card>

      </div>
    )
  }
}
