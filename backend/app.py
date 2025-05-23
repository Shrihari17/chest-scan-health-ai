from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import os
import datetime
import numpy as np
from flask import render_template, redirect, url_for, flash, session
from flask_mysqldb import MySQL
import MySQLdb.cursors
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

app = Flask(__name__)
CORS(app, supports_credentials=True)

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'jit123'
app.config['MYSQL_DB'] = 'sample'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'  # Return results as dictionaries

mysql = MySQL(app)
app.secret_key = 'your_secret_key'  # Change this to a secure secret key

# Test database connection
@app.route('/test-db')
def test_db():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT 1')
        cursor.close()
        return jsonify({'message': 'Database connection successful!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# User Registration
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')  # In production, hash this password
        dob = data.get('dob')
        phone = data.get('phone')
        medical_history = data.get('medicalHistory', '')

        cursor = mysql.connection.cursor()
        
        # Check if email already exists
        cursor.execute('SELECT * FROM patients WHERE email = %s', (email,))
        if cursor.fetchone():
            return jsonify({'error': 'Email already registered'}), 400

        # Check if phone already exists
        cursor.execute('SELECT * FROM patients WHERE phone = %s', (phone,))
        if cursor.fetchone():
            return jsonify({'error': 'Phone number already registered'}), 400

        # Insert new user
        cursor.execute(
            'INSERT INTO patients (name, email, password_hash, dob, phone, medical_history) VALUES (%s, %s, %s, %s, %s, %s)',
            (name, email, password, dob, phone, medical_history)
        )
        mysql.connection.commit()
        
        cursor.close()
        return jsonify({'message': 'Registration successful'})
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'error': str(e)}), 500

# User Login
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM patients WHERE email = %s AND password_hash = %s', (email, password))
        user = cursor.fetchone()
        cursor.close()

        if user:
            session['user_id'] = user['id']
            return jsonify({
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'dob': user['dob'].strftime('%Y-%m-%d') if user['dob'] else None,
                'phone': user['phone'],
                'medicalHistory': user['medical_history']
            })
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': str(e)}), 500

# Logout
@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'})

# Get User Profile
@app.route('/profile')
def get_profile():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT id, name, email, dob, phone, medical_history FROM patients WHERE id = %s', (session['user_id'],))
        user = cursor.fetchone()
        cursor.close()

        if user:
            return jsonify({
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'dob': user['dob'].strftime('%Y-%m-%d') if user['dob'] else None,
                'phone': user['phone'],
                'medicalHistory': user['medical_history']
            })
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print(f"Profile error: {e}")
        return jsonify({'error': str(e)}), 500

# Load Pneumonia Detection Model
model = load_model("D:/FINAL YEAR(sample database)/best_model_fold_5.weights (5).h5")
labels = ["Normal", "Pneumonia"]

def predict_pneumonia(image_path):
    """Processes the uploaded chest X-ray image and predicts if it indicates pneumonia."""
    try:
        img = load_img(image_path, target_size=(128, 128))
        img_array = img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        prediction = model.predict(img_array)

        if prediction.shape[1] == 1:  # Binary classification
            result = "Pneumonia" if prediction[0][0] == 1 else "Normal"
        else:  # Multi-class classification
            predicted_class = np.argmax(prediction)
            result = labels[predicted_class]

        return result, prediction[0][predicted_class] if prediction.shape[1] > 1 else prediction[0][0]
    except Exception as e:
        print(f"Prediction error: {e}")
        return "Error in prediction", 0

def image_to_base64(image_path):
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')

@app.route('/detect', methods=['POST'])
def detect():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
        
    uploaded_file = request.files['file']
    if not uploaded_file:
        return jsonify({'error': 'No file provided'}), 400
    
    try:
        # Save the uploaded file
        upload_folder = "static/uploads"
        os.makedirs(upload_folder, exist_ok=True)
        image_path = os.path.join(upload_folder, uploaded_file.filename)
        uploaded_file.save(image_path)
        
        # Get prediction and confidence
        result, confidence = predict_pneumonia(image_path)
        
        # Convert image to base64 for response
        img_base64 = image_to_base64(image_path)
        
        # Generate report
        os.makedirs('static/reports', exist_ok=True)
        report_filename = f"report_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
        report_path = os.path.join('static/reports', report_filename)
        
        # Generate the HTML report
        with open(report_path, 'w') as report_file:
            report_file.write(f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Pneumonia Detection Report</title>
    <style>
        body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; text-align: center; }}
        header {{ background-color: #4CAF50; color: white; padding: 15px 0; }}
        main {{ margin: 20px; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }}
        img {{ max-width: 100%; height: auto; border-radius: 8px; }}
    </style>
</head>
<body>
    <header><h1>Pneumonia Detection Report</h1></header>
    <main>
        <h2>Results</h2>
        <p>Prediction: <strong>{result}</strong></p>
        <p>Confidence: <strong>{confidence:.2%}</strong></p>
        <h3>X-Ray Image</h3>
        <img src="data:image/jpeg;base64,{img_base64}" alt="Chest X-Ray">
        <p>Generated on: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
    </main>
</body>
</html>""")
        
        return jsonify({
            'prediction': result,
            'confidence': float(confidence),
            'image_url': f"data:image/jpeg;base64,{img_base64}",
            'report_id': f"REP_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'report_download_url': f"/static/reports/{report_filename}"
        })
        
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '').lower()
        response = get_chat_response(message)
        return jsonify({'response': response})
    except Exception as e:
        print(f"Error in chat: {e}")
        return jsonify({'error': str(e)}), 500

def get_chat_response(message):
    responses = {
        "symptoms": "Common symptoms of pneumonia include chest pain, coughing, fatigue, fever, shortness of breath...",
        "causes": "Pneumonia is typically caused by infection with bacteria, viruses, or fungi...",
        "treatment": "Treatment depends on the cause of pneumonia. Bacterial pneumonia is treated with antibiotics...",
        "prevention": "Vaccination is key to preventing pneumonia. Both pneumococcal and flu vaccines can help...",
        "diagnosis": "Pneumonia is diagnosed through physical examinations, chest X-rays, blood tests...",
        "risk": "People at higher risk for pneumonia include older adults, young children, smokers..."
    }
    
    for key, value in responses.items():
        if key in message:
            return value
    
    return "I'm here to help with questions about pneumonia. You can ask about symptoms, causes, treatment, prevention, or diagnosis."

# This endpoint allows checking if the Flask server is running
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Flask server is running'})

# Serve static files
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True)
