import json
import os
from venv import create
from flask import Flask, request
from db_credentials import config
from apikey import apiKey
from db_connector import connect_to_database, execute_query
import requests
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '/home/bailey/projects/recipe-book/frontend/public'

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
    recipes = cursor.fetchall()
    cursor.close()
    for recipe in recipes:
        rId = getRecipeId(conn, {"name": recipe[2]})
        ingredients = getRecipeIngredients(conn, rId)
        print(ingredients)
        # for ingredient in ingredients:

    return {"results": recipes}


@app.route("/getrecipe")
def getRecipe():
    conn = connect_to_database()
    recipe = request.args.get("recipe")

    query = "select * from recipes where recipe_name=%s"
    cursor = execute_query(conn, query, (recipe,))
    recipe = cursor.fetchall()[0]
    recipeId = recipe[0]

    query = "select * from recipe_ingredients where recipe_id=%s"
    cursor = execute_query(conn, query, (recipeId,))
    ingredients = cursor.fetchall()
    cursor.close()

    ingList = []
    for ingredient in ingredients:
        ingId = ingredient[2]
        qId = ingredient[3]

        query = "select ing_name from ingredients where ing_id=%s"
        cursor = execute_query(conn, query, (ingId,))
        ing = cursor.fetchall()[0][0]
        cursor.close()

        query = "select quantity from quantities where q_id=%s"
        cursor = execute_query(conn, query, (qId,))
        quantity = cursor.fetchall()[0][0]
        cursor.close()

        ingList.append(f"{quantity} {ing}")

    return {"recipe": recipe, "ingredients": ingList}


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


@app.route("/uploadpicture", methods=['POST'])
def uploadFile():
    if 'file' not in request.files:
        print("no file 1")
        return {"error": "no file uploaded"}
    file = request.files['file']
    if file.filename == '':
        print("no file 2")
        return {"error": "no file uploaded"}
    if file and allowed_file(file.filename): 
        print("ok file")
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return {"filepath": app.config['UPLOAD_FOLDER'] + filename}

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


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def getRecipeValues(request):
    formData = request.form.to_dict()
    
    recipe = {
        "name": formData.get('name'),
        "description": formData.get('description'),
        "ingredients": formData.get('ingredients'),
        "instructions": formData.get('instructions'),
        "time": formData.get('time'),
        "image": app.config['UPLOAD_FOLDER'] + formData.get('image'),
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

def getRecipeIngredients(conn, queryParams):
    query = "select * from recipe_ingredients where recipe_id=%s;"
    cursor = execute_query(conn, query, (queryParams,))
    results = cursor.fetchall()
    cursor.close()
    return results

def parseIngredients(recipe):
    # parse ingredients out into quantities and ingredient names
    parseUrl = f"https://api.spoonacular.com/recipes/parseIngredients?apiKey={apiKey}"
    ingredients = json.loads(recipe["ingredients"])
    ingString = '\n'.join(ingredients)
    postData = {
        "includeNutrition": False,
        "servings": 1,
        "ingredientList": ingString
    }

    req = requests.post(parseUrl, (postData))
    parsedIngredients = req.json()
    return parsedIngredients


if __name__ == "__main__":
    app.run(debug=True)
