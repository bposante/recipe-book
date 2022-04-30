import mariadb
from db_credentials import config


def connect_to_database(config=config):

    db_connection = mariadb.connect(**config)
    return db_connection

def execute_query(db_connection = None, query = None, query_params = ()):

    if db_connection is None:
        print("No connection to the database found! Have you called connect_to_database() first?")
        return None

    if query is None or len(query.strip()) == 0:
        print("query is empty! Please pass a SQL query in query")
        return None

    print("Executing %s with %s" % (query, query_params))
    cursor = db_connection.cursor()

    cursor.execute(query, query_params)
    db_connection.commit()
    return cursor

if __name__ == '__main__':
    print("Executing a sample query on the database using the credentials from db_credentials.py")
    db = connect_to_database()
    query = "SELECT * from recipes;"
    results = execute_query(db, query)
    print("Printing results of %s" % query)

    for r in results.fetchall():
        print(r)
