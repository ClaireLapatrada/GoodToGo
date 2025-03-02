from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({'message': 'Hello from Flask backend!'})

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Running on port 5001
