import requests
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/test")
def test():
    return{"test": "test"}


@app.route("/convert")
def convert():
    ingredientName = request.args.get('ingredientName')
    sourceAmount = request.args.get('sourceAmount')
    sourceUnit = request.args.get('sourceUnit')
    targetUnit = request.args.get('targetUnit')

    if None in (ingredientName, sourceAmount, sourceUnit, targetUnit):
        return("ERROR: Invalid request! Ensure request contains values for ingredientName, sourceAmount, sourceUnit, and targetUnit.")
    else:
        x = requests.get('https://api.spoonacular.com/recipes/convert?apiKey=3e3a2dd32f83429d8a063a863c5ffb9a&ingredientName=' +
                         ingredientName + '&sourceAmount=' + sourceAmount + '&sourceUnit=' + sourceUnit + '&targetUnit=' + targetUnit)
        result = x.json()
        return {"response": result['answer']}


if __name__ == "__main__":
    app.run(debug=True, port=5001)
