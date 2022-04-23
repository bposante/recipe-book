import React from 'react';
import './Card.css';

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recipe: props.recipe,
        };
    }

    render() {
        return (
            <div className='card-component'>
                <div >{this.state.recipe.name}</div>
                <div >{this.state.recipe.ingredients}</div>
            </div>
        )
    }
}

export default Card;