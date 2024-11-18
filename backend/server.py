from flask import Flask, request, jsonify, send_file, send_from_directory
from database_functions.pictures import insert_picture, get_urls, remove_picture, edit_picture
from cloudinaryconfig import cloudinary
import cloudinary.uploader
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__, 
    static_folder='../build',  # Use build folder in production
    static_url_path='')

# Configure server for production
app.config['ENV'] = 'production'
app.config['DEBUG'] = False

# Get allowed origins from environment for local and Render
cors_origins = os.environ.get("CORS_ORIGIN", "https://campushunt.onrender.com/")
CORS(app, resources={r"/*": {"origins": cors_origins}})

# Serve static files
@app.route("/static/<path:path>")
def serve_static(path):
    return send_from_directory(os.path.join(app.static_folder, "static"), path)

# Catch all routes and serve index.html
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path.startswith("api/"):
        return "Not found", 404
    try:
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')
    except Exception as e:
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

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)