import psycopg2

db_link = "postgresql://campushuntdata_user:EvlUNiEaq9t4bLPzC4EVrmOwoNULuNl7@dpg-csgjh12j1k6c739fi10g-a.ohio-postgres.render.com/campushuntdata"

def insert_picture(url, coordinates, description, public_id):
    # Replace with your database connection details
    conn = psycopg2.connect(db_link)
    cursor = conn.cursor()

    # Read the SQL query from the file
    # with open('sql/pictures.sql', 'r') as sql_file:
    #     query = sql_file.read()

    try:
        # Execute the query with user input
        cursor.execute(
            '''
            INSERT INTO Princeton_pictures (URL, Coordinates, label_description, public_id)
            VALUES (%s, %s, %s, %s);
            ''',
            (url, coordinates, description, public_id)
        )
        conn.commit()
        print("Record inserted successfully.")
    except Exception as e:
        print("database error")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def print_rows():
    conn = psycopg2.connect(db_link)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Princeton_pictures")
    try:
        rows = cursor.fetchall()
        for row in rows:
            print(row)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        cursor.close()
        conn.close()

def clear_table():
    conn = psycopg2.connect(db_link)
    cursor = conn.cursor()
    
    # Delete all records from the table
    cursor.execute("DELETE FROM Princeton_pictures")
    
    # Reset the primary key sequence
    cursor.execute("ALTER SEQUENCE princeton_pictures_id_seq RESTART WITH 1")
    
    conn.commit()
    cursor.close()
    conn.close()

def get_urls():
    # Establish the database connection
    conn = psycopg2.connect(db_link)
    cursor = conn.cursor()
    
    try:
        # Call the function to retrieve URLs
        cursor.execute("SELECT URL, public_id FROM Princeton_pictures;")
        
        # Fetch all URLs and public_ids
        urls = cursor.fetchall()
        
        # Construct a list of dictionaries, each containing a url and a public_id
        url_list = [{"url": url[0], "public_id": url[1]} for url in urls]
        return url_list

    except Exception as e:
        print(f"An error occurred: {e}")
        return []

    finally:
        cursor.close()
        conn.close()

    
def remove_picture(name):
    conn = psycopg2.connect(db_link)
    cursor = conn.cursor()

    try:
        cursor.execute("DELETE FROM Princeton_pictures WHERE public_id = %s;", (name,))
        conn.commit()
        print("Record deleted successfully.")
        return {"success": True}
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"database error"}
    finally:
        cursor.close()
        conn.close()

def edit_picture(public_id, new_latitude="", new_longitude="", new_description=""):
    conn = psycopg2.connect(db_link)
    cursor = conn.cursor()
    
    try:
        # Retrieve current values: coordinates array (latitude and longitude) and description
        cursor.execute("SELECT coordinates[1], coordinates[2], label_description FROM Princeton_pictures WHERE public_id = %s;", (public_id,))
        result = cursor.fetchone()
        
        if not result:
            print("Record not found.")
            return {"error": "Record not found."}
        
        current_latitude, current_longitude, current_description = result

        # Use existing values if the new ones are empty
        latitude = new_latitude if new_latitude else current_latitude
        longitude = new_longitude if new_longitude else current_longitude
        description = new_description if new_description else current_description

        # Update record, setting new coordinates array and description
        cursor.execute(
            """
            UPDATE Princeton_pictures
            SET coordinates = ARRAY[%s, %s], label_description = %s
            WHERE public_id = %s;
            """,
            (latitude, longitude, description, public_id)
        )
        
        conn.commit()
        print("Record updated successfully.")
        return {"success": True}
    
    except Exception as e:
        print("database error")
        return "database error"
    
    finally:
        cursor.close()
        conn.close()


def get_random_picture():
    conn = psycopg2.connect(db_link)
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT URL, Coordinates, label_description, public_id 
            FROM Princeton_pictures 
            ORDER BY RANDOM() 
            LIMIT 1
        """)
        result = cursor.fetchone()
        if result:
            return {
                'url': result[0],
                'coordinates': result[1],
                'description': result[2],
                'public_id': result[3]
            }
        return None
    except Exception as e:
        print(f"Error getting random picture: {e}")
        return None
    finally:
        cursor.close()
        conn.close()

def main():
    # insert_picture("https://www.example.com", [40.35, -74.65], "A picture of Princeton University")
    #print_rows()
    # for url in get_urls():
    #     print(url)
    #clear_table()
    # Test random picture function
    random_pic = get_random_picture()
    if random_pic:
        print("Random picture:", random_pic)

if __name__ == "__main__":
    main()
