import React from "react"
import "./Header.css"
import Button from "@mui/material/Button"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import AddIcon from "@mui/icons-material/Add"

class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit" component="div">
              HOMECOOK
            </Typography>
            <Button variant="contained" color="info" className="add-recipe_button" onClick={this.props.addRecipe}>
              <AddIcon></AddIcon>
              Add Recipe
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    )
  }
}

export default Header
