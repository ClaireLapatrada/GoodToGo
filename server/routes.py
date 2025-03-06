from flask import Flask, request, jsonify
import os
import base64
import json
from functions import condition_grading, recommended_action, recommended_repair  # Import all functions
from wardrobing import *
from yolo import *

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def init_routes(app):
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    # initialize Yolo Model
    model_paths = {
        "model1": {
            "weights": "yoloResources/holes.onnx",
            "classes": "yoloResources/clothingDefect.yaml"
        },
        "model2": {
            "weights": "yoloResources/stainDetectorFR.onnx",
            "classes": "yoloResources/stains.yaml"
        }
    }
    # Load all models
    for model_name, paths in model_paths.items():
        add_model(model_name, paths["weights"], paths["classes"])

    @app.route('/api/data', methods=['GET'])
    def get_data():
        # Mock data for product assessment
        assessment_data = {
            'condition': 'Used-Good',
            'estimatedRefundValue': 120,
            'isEligibleToReturn': True,
            'noRepairsNeeded': True,
            'withinReturnWindow': True
        }
        print('Returning assessment data:', assessment_data)
        return jsonify(assessment_data)

    @app.route('/api/data', methods=['POST'])
    def condition_grading_route():
        try:
            # Get the price from the request (default to "100" if not provided)
            price = request.form.get('price', '100')
            
            # Correctly extract userData
            if request.is_json:
                userData = request.get_json().get('userData', {})
            else:
                userData = request.form.get('userData', '{}')  # Default to empty JSON string if missing
                try:
                    userData = json.loads(userData)  # Convert string to dictionary
                except json.JSONDecodeError:
                    return jsonify({"message": "Invalid JSON in userData"}), 400

            saved_photos = []
            encoded_images = []

            # Check if 'photos' part is present in the request
            if 'photos' not in request.files:
                return jsonify({"message": "No photos part in the request"}), 400

            photos = request.files.getlist('photos')
            filenames = []
            # Save the photos
            for index, photo in enumerate(photos):
                if photo and allowed_file(photo.filename):
                    filename = f"photo_{index + 1}.jpg"
                    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    filenames.append(filepath)
                    photo.save(filepath)
                    saved_photos.append(filepath)

            print('Received photos:', saved_photos)
            print('Received price:', price)

            for index, photo in enumerate(photos):
                with open(filenames[index], "rb") as img_file:
                    img_data = img_file.read()
                    encoded_img = base64.b64encode(img_data).decode('utf-8')
                    # Just add the raw encoded image string to the array
                    encoded_images.append(encoded_img)

            # Ensure all results are JSON serializable by converting NumPy types
            grading_result = int(condition_grading(price)) if isinstance(condition_grading(price), np.integer) else condition_grading(price)
            action_result = int(recommended_action(price)) if isinstance(recommended_action(price), np.integer) else recommended_action(price)
            repair_result = recommended_repair()  # Assuming this is already JSON safe
            wardrobing_result = is_wardrobe(userData)

            # Return the grading results, recommended action, and recommended repair as a response
            return jsonify({
                "message": "Data received and photos uploaded successfully!",
                "images": encoded_images,
                "grading_result": grading_result,
                "recommended_action": action_result,
                "recommended_repair": repair_result,
                "wardrobing_result": wardrobing_result
            }), 200

        except Exception as e:
            print(f"Error processing the request: {e}")
            return jsonify({"message": f"Error processing the data: {str(e)}"}), 500



# Initialize the Flask app
app = Flask(__name__)
init_routes(app)

if __name__ == '__main__':
    app.run(debug=True)
