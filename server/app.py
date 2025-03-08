from flask import Flask
from flask_cors import CORS
from routes import init_routes

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# Initialize routes
init_routes(app)

if __name__ == '__main__':
    app.run(debug=True, host="10.0.0.172", port=5000)
