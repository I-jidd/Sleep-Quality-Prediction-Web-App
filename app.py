import pandas as pd
import numpy as np
import pickle
from flask import Flask, request, jsonify, render_template
from preprocessing import preprocess_input  

# --- 1. Initialize Flask App ---
app = Flask(__name__)

# --- 2. Load Model and Preprocessing Objects ---
try:
    with open('models/best_model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('models/model_columns.pkl', 'rb') as f:
        model_columns = pickle.load(f)
    with open('models/model_columns_final.pkl', 'rb') as f:
        model_columns_final = pickle.load(f)
    print("Model and columns loaded successfully.")
except FileNotFoundError as e:
    print(f"Error loading model files: {e}")
    print("Please make sure 'model.pkl', 'model_columns.pkl', and 'model_columns_final.pkl' are in the root directory.")
except Exception as e:
    print(f"An error occurred during model loading: {e}")


# --- 3. Define the Home Page Route ---
@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

# --- 4. Define the Prediction Endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)
        
        # --- 5. Preprocess the New Data ---
        df_final = preprocess_input(data)
        
        # --- 6. Make Prediction ---
        prediction = model.predict(df_final)
        prediction_proba = model.predict_proba(df_final)
        
        # --- 7. Return Response ---
        output = int(prediction[0])
        output_text = "Good Sleep Quality" if output == 1 else "Poor Sleep Quality"
        confidence = prediction_proba[0][output]
        
        return jsonify({
            "prediction": output, 
            "prediction_text": output_text,
            "confidence": confidence
        })
    
    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"error": "Failed to process request."}), 500
