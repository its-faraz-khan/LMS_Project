import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_db():
    try:
        con = psycopg2.connect(
            dbname='postgres',
            user='postgres',
            password='@Uckhan@6435',
            host='localhost'
        )
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        cur.execute('CREATE DATABASE lms_db')
        print("Database lms_db created successfully")
        cur.close()
        con.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_db()
