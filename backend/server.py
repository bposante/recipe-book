from venv import create
from flask import Flask
import mariadb
from db_credentials import config
from db_connector import connect_to_database, execute_query
# from db_connector import connect_to_database, execute_query

app = Flask(__name__)

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
    cursor.execute("CREATE TABLE diagnostic(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL);")
    cursor.execute("insert into diagnostic (text) values('hehhlo')")
    cursor.execute("select * from diagnostic;")
    res = cursor.fetchall()
    print(res)
    return {'res': res}

if __name__ == "__main__":
    app.run(debug=True)