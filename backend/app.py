
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
CORS(app, supports_credentials=True)  # Enable CORS with credentials

# ... keep existing code (MySQL configuration and model loading)

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
        
        # Get prediction
        result = predict_pneumonia(image_path)
        
        # Convert image to base64 for response
        img_base64 = image_to_base64(image_path)
        
        # Generate unique report ID
        report_id = f"REP_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Calculate confidence (modify based on your model's output)
        confidence = 0.95  # You should get this from your model's prediction
        
        return jsonify({
            'prediction': result,
            'confidence': confidence,
            'image_url': f"data:image/jpeg;base64,{img_base64}",
            'report_id': report_id
        })
        
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': str(e)}), 500

# Add new route for chatbot
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '').lower()
        
        # Use your existing response mapping
        response = get_chat_response(message)
        
        return jsonify({
            'response': response
        })
    except Exception as e:
        print(f"Error in chat: {e}")
        return jsonify({'error': str(e)}), 500

def get_chat_response(message):
    # Your existing chat response logic
    responses = {
        "symptoms": "Common symptoms of pneumonia include chest pain, coughing, fatigue, fever, shortness of breath...",
        "causes": "Pneumonia is typically caused by infection with bacteria, viruses, or fungi...",
        "treatment": "Treatment depends on the cause of pneumonia. Bacterial pneumonia is treated with antibiotics...",
        "prevention": "Vaccination is key to preventing pneumonia. Both pneumococcal and flu vaccines can help...",
        "diagnosis": "Pneumonia is diagnosed through physical examinations, chest X-rays, blood tests...",
        "risk": "People at higher risk for pneumonia include older adults, young children, smokers..."
    }
    
    # Simple keyword matching
    for key, value in responses.items():
        if key in message:
            return value
    
    return "I'm here to help with questions about pneumonia. You can ask about symptoms, causes, treatment, prevention, or diagnosis."

if __name__ == '__main__':
    app.run(debug=True)
