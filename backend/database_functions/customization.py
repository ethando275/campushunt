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

def main():
    create_table()
    print_rows()

if __name__ == "__main__":
    main()
