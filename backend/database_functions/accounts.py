import psycopg2

db_link = "postgresql://campushuntdata_user:EvlUNiEaq9t4bLPzC4EVrmOwoNULuNl7@dpg-csgjh12j1k6c739fi10g-a.ohio-postgres.render.com/campushuntdata"

def create_table():
    try:
        with psycopg2.connect(db_link) as conn:
            with conn.cursor() as cur:
                cur.execute('''CREATE TABLE Accounts (
                    id SERIAL PRIMARY KEY,
                    university_name VARCHAR(100) NOT NULL DEFAULT '',
                    username VARCHAR(100) NOT NULL DEFAULT '',
                    password VARCHAR(100) NOT NULL DEFAULT ''
                );''')
                
                conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    return "database error"

def print_rows():
    conn = psycopg2.connect(db_link)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Accounts")
    try:
        rows = cursor.fetchall()
        for row in rows:
            print(row)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        cursor.close()
        conn.close()

def add_account(university_name, username, password):
    conn = psycopg2.connect(db_link)
    cursor = conn.cursor()

    try:
        cursor.execute(
            '''
            INSERT INTO Accounts (university_name, username, password)
            VALUES (%s, %s, %s);
            ''',
            (university_name, username, password)
        )
        conn.commit()
        print("Row inserted successfully.")
    except Exception as e:
        print("database error")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def get_school(username):
    conn = psycopg2.connect(db_link)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT university_name FROM Account WHERE username = %s", (username,))
        row = cursor.fetchall()
        return row[0]

    except Exception as e:
        print(f"An error occurred: {e}")
        return []

    finally:
        cursor.close()
        conn.close()

def main():
    # create_table()
    print_rows()
    # add_account("Princeton", "princeton_university", "gotigers!")

if __name__ == "__main__":
    main()
