import psycopg2

db_link = "postgresql://campushuntdata_user:EvlUNiEaq9t4bLPzC4EVrmOwoNULuNl7@dpg-csgjh12j1k6c739fi10g-a.ohio-postgres.render.com/campushuntdata"

def create_table():
    try:
        with psycopg2.connect(db_link) as conn:
            with conn.cursor() as cur:
                cur.execute('''CREATE TABLE Princeton_users (
                    username VARCHAR(500) NOT NULL DEFAULT '',
                    total_points INT NOT NULL DEFAULT 0,
                    daily_points INT NOT NULL DEFAULT 0,
                    distance DOUBLE PRECISION NOT NULL DEFAULT 0.0,
                    played BOOLEAN NOT NULL DEFAULT FALSE,
                    date_last_played DATE NOT NULL DEFAULT CURRENT_DATE,
                    streak INT NOT NULL DEFAULT 0,
                    PRIMARY KEY (username)
                );''')
                
                conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    return "database error"

def print_rows():
    conn = psycopg2.connect(db_link)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Princeton_users")
    try:
        rows = cursor.fetchall()
        for row in rows:
            print(row)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        print("Finished printing!")
        cursor.close()
        conn.close()

def add_user(username):
    conn = psycopg2.connect(db_link)
    cursor = conn.cursor()

    try:
        cursor.execute(
            '''
            INSERT INTO Princeton_users (username)
            VALUES (%s);
            ''',
            (username,)
        )
        conn.commit()
        print("User inserted successfully.")
    except Exception as e:
        print("database error")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def update_user(username, total_points, daily_points, distance, played, streak):
    conn = psycopg2.connect(db_link)
    cursor = conn.cursor()
    
    try:
        cursor.execute('''UPDATE princeton_users
            SET 
                total_points = %s,
                daily_points = %s,
                distance = %s,
                played = %s,
                date_last_played = CURRENT_DATE,
                streak = %s
            WHERE username = %s;
            ''', (
                total_points,            
                daily_points,             
                distance,            
                played,             
                streak,             
                username   
        ))
        conn.commit()
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

    finally:
        print("Updated user.")
        cursor.close()
        conn.close()

def main():
    # create_table()
    # add_user("winsice")
    update_user("winsice", 1, 1, 5, True, 1)
    print_rows()

if __name__ == "__main__":
    main()
