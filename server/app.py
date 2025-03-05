from flask import Flask
from flask_cors import CORS
from routes import init_routes

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# Initialize routes
init_routes(app)

if __name__ == '__main__':
    app.run(debug=True, host="192.168.68.70", port=5000)
