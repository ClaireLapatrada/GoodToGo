from flask import Flask, request, jsonify
import datetime
import os
from functions import condition_grading  # Import the condition_grading function

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def init_routes(app):
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
            saved_photos = []

            # Check if 'photos' part is present in the request
            if 'photos' not in request.files:
                return jsonify({"message": "No photos part in the request"}), 400

            photos = request.files.getlist('photos')
            # Generate folder name
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            folder_name = f"upload_{timestamp}"
            folder_path = os.path.join(UPLOAD_FOLDER, folder_name)
            os.makedirs(folder_path)
            # Save the photos
            for index, photo in enumerate(photos):
                if photo and allowed_file(photo.filename):
                    filename = f"photo_{index + 1}.jpg"
                    filepath = os.path.join(folder_path, filename)
                    photo.save(filepath)
                    saved_photos.append(filepath)

            print('Received photos:', saved_photos)
            print('Received price:', price)

            # Call the condition_grading function with the saved photo paths and price
            grading_result = condition_grading(price)

            # Return the grading results as a response
            return jsonify({
                "message": "Data received and photos uploaded successfully!",
                "grading_result": grading_result
            }), 200

        except Exception as e:
            print(f"Error processing the request: {e}")
            return jsonify({"message": "Error processing the data"}), 500

# Initialize the Flask app
app = Flask(__name__)
init_routes(app)

if __name__ == '__main__':
    app.run(debug=True)