import json
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


@app.route("/getrecipes")
def getRecipes():
    conn = connect_to_database()
    query = "select * from recipes;"
    cursor = execute_query(conn, query)
    res = cursor.fetchall()
    cursor.close()
    return {"results": res}


@app.route("/addrecipe", methods=['POST'])
def addrecipe():
    
    recipe = getRecipeValues(request)
    ingredients = parseIngredients(recipe)
    conn = connect_to_database()

    insertIntoRecipes(conn, recipe)
    recipeId = getRecipeId(conn, recipe)

    for ingredient in ingredients:
        quantity = f'{ingredient["amount"]} {ingredient["unit"]}'
        name = ingredient["name"]

        queryParams = (name,)
        insertIntoIngredients(conn, queryParams)
        ingId = getIngredientId(conn, queryParams)
        
        queryParams = (quantity,)
        insertIntoQuantities(conn, queryParams)
        qId = getQuantityId(conn, queryParams)
        
        queryParams = (recipeId, ingId, qId)
        insertIntoRecipeIngredients(conn, queryParams)

    conn.close()
    return {"result": "success"}


def getRecipeValues(request):
    formData = request.form.to_dict()
    
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

def insertIntoRecipes(conn, recipe):
    query = "insert into recipes (recipe_name, make_time, servings, description, instructions, image) values (%s, %s, %s, %s, %s, %s);"
    queryParams = (recipe["name"], recipe["time"], recipe["servings"],
                   recipe["description"], recipe["instructions"], recipe["image"])
    cursor = execute_query(conn, query, queryParams)
    cursor.close()

def getRecipeId(conn, recipe):
    query = "select recipe_id from recipes where recipe_name=%s;"
    queryParams = (recipe["name"],)
    cursor = execute_query(conn, query, queryParams)
    recipeId = cursor.fetchall()[0][0]
    cursor.close()
    return recipeId

def insertIntoIngredients(conn, queryParams):
    query = "insert ignore into ingredients (ing_name) values (%s);"
    cursor = execute_query(conn, query, queryParams)
    cursor.close()

def getIngredientId(conn, queryParams):
    query = "select ing_id from ingredients where ing_name=%s;"
    cursor = execute_query(conn, query, queryParams)
    ingId = cursor.fetchall()[0][0]
    cursor.close()
    return ingId

def insertIntoQuantities(conn, queryParams):
    query = "insert ignore into quantities (quantity) values (%s);"
    cursor = execute_query(conn, query, queryParams)
    cursor.close()

def getQuantityId(conn, queryParams):
    query = "select q_id from quantities where quantity=%s;"
    cursor = execute_query(conn, query, queryParams)
    qId = cursor.fetchall()[0][0]
    cursor.close()
    return qId

def insertIntoRecipeIngredients(conn, queryParams):
    query = "insert into recipe_ingredients (recipe_id, ing_id, q_id) values (%s, %s, %s);"
    cursor = execute_query(conn, query, queryParams)
    cursor.close()

def parseIngredients(recipe):
    # parse ingredients out into quantities and ingredient names
    parseUrl = f"https://api.spoonacular.com/recipes/parseIngredients?apiKey={apiKey}"
    
    postData = {
        "includeNutrition": False,
        "servings": 1,
        "ingredientList": json.loads(recipe["ingredients"])
    }

    req = requests.post(parseUrl, (postData))
    parsedIngredients = req.json()
    return parsedIngredients


if __name__ == "__main__":
    app.run(debug=True)
