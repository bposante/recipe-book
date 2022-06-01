from asyncio import sleep
import json
from sqlite3 import IntegrityError
from venv import create
from flask import Flask, request
from db_credentials import config
from apikey import apiKey
from db_connector import connect_to_database, execute_query
import requests

app = Flask(__name__)

# sudo service mysql start
# sudo mariadb to connect to database

# Home route


@app.route("/home")
def home():
    return {"home": "hello world!"}


@app.route("/test")
def test():
    conn = connect_to_database()
    cursor = conn.cursor()
    cursor.execute("drop table if exists diagnostic;")
    cursor.execute(
        "CREATE TABLE diagnostic(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL);")
    cursor.execute("insert into diagnostic (text) values('hehhlo')")
    cursor.execute("select * from diagnostic;")
    res = cursor.fetchall()
    print(res)
    return {'res': res}


@app.route("/addrecipe", methods=['POST'])
def addrecipe():
    # get recipe form values
    
    recipe = getRecipeValues(request)
    # parse ingredients
    ingredients = parseIngredients(recipe)

    # add recipe to recipes table
    conn = connect_to_database()
    print(recipe)
    query = "insert into recipes (recipe_name, make_time, servings, description, instructions, image) values (%s, %s, %s, %s, %s, %s);"
    queryParams = (recipe["name"], recipe["time"], recipe["servings"],
                   recipe["description"], recipe["instructions"], recipe["image"])
    cursor = execute_query(conn, query, queryParams)
    cursor.close()

    query = "select recipe_id from recipes where recipe_name=%s;"
    queryParams = (recipe["name"],)
    cursor = execute_query(conn, query, queryParams)
    recipeId = cursor.fetchall()
    cursor.close()

    # for each parsed ingredient:
    # add ingredient to ingredients table
    # add quantity to quantities table
    # add entry to recipes_ingredients table
    for ingredient in ingredients:
        quantity = f'{{ingredient.amount}} {{ingredient.unit}}'
        name = ingredient.name

        query = "insert into ingredients (ing_name) values (%s);"
        queryParams = (name,)
        cursor = execute_query(conn, query, queryParams)
        cursor.close()

        query = "select ing_id from ingredients where ing_name=%s;"
        cursor = execute_query(conn, query, queryParams)
        ingId = cursor.fetchall()
        cursor.close()

        query = "insert into quantities (quantitiy) values (%s);"
        queryParams = (quantity,)
        cursor = execute_query(conn, query, queryParams)
        cursor.close()

        query = "select q_id from quantities where quantity=%s;"
        cursor = execute_query(conn, query, queryParams)
        qId = cursor.fetchall()
        cursor.close()

        query = "insert into recipe_ingredients (recipe_id, ing_id, q_id) values (%s, %s, %s);"
        queryParams = (recipeId, ingId, qId)
        cursor = execute_query(conn, query, queryParams)
        res = cursor.fetchall()
        cursor.close()
        print(res)

    conn.close()
    return {"stuff": cursor}


def getRecipeValues(request):
    formData = request.form.to_dict()
    print('\n')
    print('\n')
    print(formData)
    print('\n')
    print('\n')
    recipe = {
        "name": formData.get('name'),
        "description": formData.get('description'),
        "ingredients": formData.get('ingredients'),
        "instructions": formData.get('instructions'),
        "time": formData.get('time'),
        "image": formData.get('image'),
        "servings": formData.get('servings')
    }
    return recipe


def parseIngredients(recipe):
    # parse ingredients out into quantities and ingredient names
    parseUrl = f"https://api.spoonacular.com/recipes/parseIngredients?apiKey={apiKey}"
    postData = {
        "includeNutrition": False,
        "servings": 1,
        "ingredientList": recipe["ingredients"]
    }

    req = requests.post(parseUrl, json.dumps(postData))
    parsedIngredients = req.json()
    return parsedIngredients


if __name__ == "__main__":
    app.run(debug=True)
