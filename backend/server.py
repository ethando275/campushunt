from flask import Flask, request, jsonify, send_file, send_from_directory, redirect, session
from database_functions.pictures import insert_picture, get_urls, remove_picture, edit_picture, get_random_picture
from database_functions.customization import get, get_customizations
from cloudinaryconfig import cloudinary
import cloudinary.uploader
import os
import sys
from werkzeug.utils import secure_filename
from flask_cors import CORS
from auth2 import login, callback, logoutapp
from datetime import timedelta

app = Flask(__name__, 
    static_folder='../build',
    static_url_path='')

# Configure server for production
app.config['ENV'] = 'production'
app.config['DEBUG'] = False
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev")

# Session configuration
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE='None',
    SESSION_COOKIE_HTTPONLY=True,
    PERMANENT_SESSION_LIFETIME=timedelta(days=7)
)

# Force HTTPS in production
class ForceHTTPS(object):
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        environ['wsgi.url_scheme'] = 'https'
        return self.app(environ, start_response)

if os.environ.get('FLASK_ENV') == 'production':
    app.wsgi_app = ForceHTTPS(app.wsgi_app)

# Get allowed origins from environment for local and Render
cors_origins = os.environ.get("CORS_ORIGINS", "http://localhost:5000,http://127.0.0.1:5000,https://campushunt.onrender.com/").split(',')
CORS(app, resources={r"/*": {"origins": cors_origins}}, supports_credentials=True)

# Add explicit routes for React routes
@app.route('/home')
@app.route('/dashboard')
@app.route('/customize')
@app.route('/images')
@app.route('/manage_users')
@app.route('/university_game_page')
@app.route('/all_game_pages')
@app.route('/princeton_menu')
@app.route('/princeton_daily')
@app.route('/guess-results')
def react_routes():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # List of valid React routes
    valid_routes = ['home', 'dashboard', 'customize', 'images', 'manage_users', 'university_game_page', 'all_game_pages', 'princeton_menu', 'princeton_daily', 'guess-results']
    
    # API endpoints should be handled by their specific routes
    if path.startswith(('deleteImage', 'get_urls', 'editImage', 'upload', 'api/random_picture')):
        return jsonify({"error": "Not found"}), 404
    
    # Check if path is a valid route
    if path and path not in valid_routes:
        # For invalid routes, redirect to home or root based on if static/index.html exists
        if os.path.isfile(os.path.join(app.static_folder, 'index.html')):
            return send_from_directory(app.static_folder, 'index.html')
        return redirect('/')
        
    # Try to serve static files from the build directory
    static_file_path = os.path.join(app.static_folder, path)
    if os.path.isfile(static_file_path):
        return send_from_directory(app.static_folder, path)
        
    # For all other routes, serve index.html
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/deleteImage', methods=['POST'])
def deleteImage():
    name = request.json['data']['public_id']
    print(name)
    cloudinary.uploader.destroy(name)
    sql = remove_picture(name)
    if sql == "database error":
        return jsonify({"error": "Database error occurred"}), 500
    return jsonify({"success": True}), 200

@app.route('/get_urls', methods=['GET'])
def get_urls_route():
    urls = get_urls()
    return jsonify(urls), 200

@app.route('/get_customizations', methods=['GET'])
def get_customizations_route():
    print("GET /get_customizations hit")
    data = get_customizations()
    return jsonify(data), 200

@app.route('/upload', methods=['POST'])
def upload_files():
    files = request.files.getlist('files')
    if not files:
        return jsonify({"error": "No files provided"}), 400

    try:
        for index, file in enumerate(files):
            description = request.form.get(f'captions[{index}][description]')
            latitude = request.form.get(f'captions[{index}][latitude]')
            longitude = request.form.get(f'captions[{index}][longitude]')

            if description is None or latitude is None or longitude is None:
                return jsonify({"error": f"Metadata for file {index} is missing"}), 400

            try:
                latitude = float(latitude)
                longitude = float(longitude)
            except ValueError:
                return jsonify({"error": "Latitude and longitude must be valid numbers"}), 400

            context = {
                'description': description,
                'latitude': latitude,
                'longitude': longitude,
            }

            result = cloudinary.uploader.upload(file, folder='Princeton', context=context)
            file_url = result.get('secure_url')
            public_id = result.get('public_id')

            if file_url:
                insert = insert_picture(file_url, [latitude, longitude], description, public_id)
                if insert == "database error":
                    return jsonify({"error": "Database error occurred"}), 500
            else:
                print(f"Error: Upload for file {index} did not return a URL.")

        return jsonify({"success": True}), 200
    except Exception as e:
        print(f"Error uploading files: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/editImage', methods=['POST'])
def editImage():
    data = request.json
    public_id = data.get('currentID')
    description = data.get('description')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    update = edit_picture(public_id, latitude, longitude, description)

    if update == "database error":
        return jsonify({"error": "Database error occurred"}), 500
    return jsonify({"success": True}), 200

@app.route('/api/random_picture', methods=['GET'])
def get_random_picture_route():
    picture = get_random_picture()
    if picture:
        return jsonify(picture)
    return jsonify({"error": "No pictures found"}), 404

@app.route('/auth/google/login')
def auth_google_login():
    return login()

@app.route('/login/callback')
def auth_google_callback():
    user_info, error = callback()
    print("Callback received - User info:", user_info, "Error:", error, file=sys.stderr)
    
    if error:
        return jsonify({"error": error}), 400
        
    if user_info:
        session['user_info'] = user_info
        print("Session after setting user_info:", dict(session), file=sys.stderr)
        return redirect('/princeton_menu')
    
    return jsonify({"error": "Authentication failed"}), 400

@app.route('/princeton_menu')
def princeton_menu():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/auth/google/logout')
def auth_google_logout():
    session.clear()
    return jsonify({"success": True})

@app.route('/api/user')
def get_user():
    print("Current session:", dict(session), file=sys.stderr)
    if 'user_info' not in session:
        return jsonify({'isAuthenticated': False}), 401
    return jsonify({
        'isAuthenticated': True,
        'user': session['user_info']
    })

@app.route('/api/maps/key')
def get_maps_key():
    return jsonify({"apiKey": os.environ.get("GOOGLE_MAPS_API_KEY")})

@app.route('/get', methods=['POST'])
def getCustom():
    req_data = request.get_json()
    column_name = req_data.get('column_name') if req_data else None
    if not column_name:
        return jsonify({"error": "column_name is required"}), 400

    data = get(column_name)
    return jsonify(data)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)