import psycopg2

db_link = "postgresql://campushuntdata_user:EvlUNiEaq9t4bLPzC4EVrmOwoNULuNl7@dpg-csgjh12j1k6c739fi10g-a.ohio-postgres.render.com/campushuntdata"

def create_table():
    try:
        with psycopg2.connect(db_link) as conn:
            with conn.cursor() as cur:
                cur.execute('''CREATE TABLE IF NOT EXISTS Princeton_customization (
                    game_title VARCHAR(500) NOT NULL DEFAULT '',
                    logo_link VARCHAR(1000) NOT NULL DEFAULT '',
                    font_selected VARCHAR(500) NOT NULL DEFAULT '',
                    share_message VARCHAR(1000) NOT NULL DEFAULT '',
                    streak_emoji VARCHAR(500) NOT NULL DEFAULT '',
                    button_style INT[] NOT NULL DEFAULT '{}',
                    color_scheme VARCHAR(50)[] NOT NULL DEFAULT '{}',
                    font_color_scheme VARCHAR(50)[] NOT NULL DEFAULT '{}');''')
                
                conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    return "database error"

def print_rows():
    conn = psycopg2.connect(db_link)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Princeton_customization")
    try:
        rows = cursor.fetchall()
        for row in rows:
            print(row)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        cursor.close()
        conn.close()

def insert_customization(game_title, logo_link, font_selected, share_message, streak_emoji, button_style, color_scheme, font_color_scheme):
    conn = psycopg2.connect(db_link)
    cursor = conn.cursor()

    try:
        cursor.execute(
            '''
            INSERT INTO Princeton_customization (game_title, logo_link, font_selected, share_message, streak_emoji, button_style, color_scheme, font_color_scheme)
            VALUES (%s, %s, %s, %s, %s, %s::int[], %s::varchar[], %s::varchar[]);
            ''',
            (game_title, logo_link, font_selected, share_message, streak_emoji, button_style, color_scheme, font_color_scheme)
        )
        conn.commit()
        print("Row inserted successfully.")
    except Exception as e:
        print("database error")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def get_customizations():
    conn = psycopg2.connect(db_link)
    cursor = conn.cursor()
    
    try:
        cursor.execute(f"SELECT * FROM Princeton_customization;")
        row = cursor.fetchall()

        return row[0]

    except Exception as e:
        print(f"An error occurred: {e}")
        return []

    finally:
        cursor.close()
        conn.close()

def get(column_name):
    conn = psycopg2.connect(db_link)
    cursor = conn.cursor()
    
    try:
        cursor.execute(f"SELECT {column_name} FROM Princeton_customization;")
        row = cursor.fetchall()

        return row[0][0]

    except Exception as e:
        print(f"An error occurred: {e}")
        return []

    finally:
        cursor.close()
        conn.close()

def main():
    print(get_customizations())
    # create_table()
    # insert_customization("Tiger Spot", "https://res.cloudinary.com/dkouv3voe/image/upload/v1733303847/logo_c3rlcw.png", "Arial", "Nice!", "fire", [0, 1], ["#e77500", "#ffbd59"], ["#000000", "#ffffff"])
    # print_rows()

if __name__ == "__main__":
    main()
