import React from "react"
import "./Card.css"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

class RecipeCard extends React.Component {
  constructor(props) {
    super(props)
    this.selectRecipe = this.selectRecipe.bind(this)
  }

  selectRecipe() {
    this.props.selectRecipe(this.props.recipe)
    this.props.showRecipe()
  }

  render() {
    return (
      <Card sx={{ maxWidth: 345, marginBottom: 1 }}>
        <CardMedia component="img" height="140" image={this.props.recipe.picture} alt="recipe image"></CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {this.props.recipe.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {this.props.recipe.description}
          </Typography>
          <div className="recipe-card_buttons">
            <Button className="view-recipe_button" size="small" variant="contained" onClick={this.selectRecipe}>
              View Recipe
            </Button>
          </div>
        </CardContent>
      </Card>

      // <div className="card-component" onClick={this.selectRecipe}>
      // 	<div>{this.props.recipe.name}</div>
      // 	<div>{this.props.recipe.ingredients}</div>
      // 	<div>{this.props.recipe.picture}</div>
      // 	<div>{this.props.recipe.time}</div>
      // </div>
    )
  }
}

export default RecipeCard
