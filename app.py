import pandas as pd
import numpy as np
import pickle
from flask import Flask, request, jsonify, render_template  # <-- Import render_template
import re
from datetime import datetime, timedelta

# --- 1. Initialize Flask App ---
app = Flask(__name__)

# --- 2. Load Model and Preprocessing Objects ---
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)
with open('model_columns.pkl', 'rb') as f:
    model_columns = pickle.load(f)
with open('model_columns_final.pkl', 'rb') as f:
    model_columns_final = pickle.load(f)
print("Model and columns loaded from .pkl files.")

# --- 3. Copy Your Helper Functions ---
# (Paste your two parser functions here)
def parse_nap_duration_to_minutes(s):
    if pd.isna(s): return np.nan
    s = str(s).lower().strip()
    if s in ['never', 'none', 'na', '0']: return 0
    if s == 'an hour': return 60
    if 'during school days' in s: return np.nan
    hour_match = re.search(r'(\d+\.?\d*)\s*(?:hour|hr|h)', s)
    min_match = re.search(r'(\d+\.?\d*)\s*(?:min|m)', s)
    if hour_match and min_match:
        try: return (float(hour_match.group(1)) * 60) + float(min_match.group(1))
        except: pass
    nums = re.findall(r'(\d+\.?\d*)', s)
    if len(nums) == 2:
        try:
            n1, n2 = float(nums[0]), float(nums[1])
            if ('min' in s or 'm' in s) and ('hour' in s or 'hr' in s): return (n1 + (n2 * 60)) / 2
            elif 'hour' in s or 'hr' in s or 'hrs' in s: return ((n1 + n2) / 2) * 60
            elif 'min' in s or 'm' in s: return (n1 + n2) / 2
            else: return ((n1 + n2) / 2) * 60
        except: pass
    if len(nums) >= 1:
        try:
            val = float(nums[0])
            if 'min' in s or 'm' in s: return val
            else: return val * 60
        except: pass
    return np.nan

def parse_latenight_study_hours(s):
    if pd.isna(s): return np.nan
    s = str(s).lower().strip()
    if s in ['yes', 'late-night', 'irregular hours', '0', 'na']: return np.nan
    if ',' in s:
        parts = s.split(',')
        total_duration = 0
        for part in parts:
            duration = parse_latenight_study_hours(part.strip())
            if not pd.isna(duration): total_duration += duration
        return total_duration if total_duration > 0 else np.nan
    if ' or ' in s:
        parts = s.split(' or ')
        total_duration = 0
        for part in parts:
            duration = parse_latenight_study_hours(part.strip())
            if not pd.isna(duration): total_duration += duration
        return total_duration if total_duration > 0 else np.nan
    times = re.findall(r'(\d+(?::\d+)?)', s)
    if len(times) == 0: return np.nan
    if len(times) == 1: return np.nan
    if len(times) == 2:
        try:
            start_str, end_str = times[0], times[1]
            def parse_time(time_str, period):
                if ':' in time_str: t = datetime.strptime(time_str, '%H:%M')
                else: t = datetime.strptime(time_str, '%H')
                hour = t.hour
                if period == 'pm' and hour < 12: hour += 12
                if period == 'am' and hour == 12: hour = 0
                return t.replace(hour=hour % 24)
            start_period = 'am' if 'am' in s.split('-')[0] else ('pm' if 'pm' in s.split('-')[0] else 'unknown')
            end_period = 'am' if 'am' in s else 'pm'
            if start_period == 'unknown':
                if end_period == 'pm': start_period = 'pm'
                elif end_period == 'am': start_period = 'pm'
            if 'am' in s.split('-')[0] and 'am' in s: start_period, end_period = 'am', 'am'
            if 'pm' in s.split('-')[0] and 'pm' in s: start_period, end_period = 'pm', 'pm'
            start_time = parse_time(start_str, start_period)
            end_time = parse_time(end_str, end_period)
            if end_time <= start_time: end_time += timedelta(days=1)
            duration = end_time - start_time
            return duration.total_seconds() / 3600.0
        except Exception as e: return np.nan
    if len(times) == 4:
        try:
            start_str, end_str = f"{times[0]}:{times[1]}", f"{times[2]}:{times[3]}"
            return parse_latenight_study_hours(f"{start_str}-{end_str} {s}")
        except: return np.nan
    return np.nan

# Copy your Ordinal Mapping
ordinal_mapping = {
    'sex': {'Female':0, 'Male':1},
    'academic_level': {'First Year':0, 'Second Year':1, 'Third Year':2, 'Fourth Year':3},
    'Caffeine_Intake_Frequency': {'Never':0, 'Almost Never':1, 'Sometimes':2, 'Fairly Often':3, 'Very Often': 4, 'Always':4},
    'screen_time_before_sleep': {'Never':0, 'less than 30 minutes':1, '30 minutes - 1 hour':2, '1 - 2 hours':3, 'More than 2 hours':4},
    'smoking_Frequency':{'Never':0, 'Almost never':1, 'Sometimes': 2, 'Fairly Often':3, 'Very Often': 4},
    'physical_activity_frequency': {'Never':0, 'Almost never':1, 'Sometimes': 2, 'Fairly Often':3, 'Very Often': 4},
    'alcohol_consumption_frequency': {'Never':0, 'Almost never':1, 'Sometimes': 2, 'Fairly Often':3, 'Very Often': 4},
    'stress_level': {'low stress': 0, 'moderate stress':1, 'high stress':2}
}

# --- 4. NEW: Define the Home Page Route ---
@app.route('/', methods=['GET'])
def home():
    # This serves your index.html from the 'templates' folder
    return render_template('index.html')

# --- 5. Define the Prediction Endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    
    # Preprocess the New Data
    df = pd.DataFrame([data], columns=model_columns)
    
    for col, map_dict in ordinal_mapping.items():
        df[col] = df[col].map(map_dict)
        
    df['daytime_nap_duration_minutes'] = df['daytime_nap_duration'].apply(parse_nap_duration_to_minutes)
    df.loc[df['daytime_nap_duration_minutes'] > 120, 'daytime_nap_duration_minutes'] = np.nan
    df['latenight_study_hours_duration'] = df['latenight_study_hours'].apply(parse_latenight_study_hours)
    
    df['daytime_nap_duration_minutes'] = df['daytime_nap_duration_minutes'].fillna(60.0) 
    df['latenight_study_hours_duration'] = df['latenight_study_hours_duration'].fillna(3.0) 
    
    df_processed = pd.get_dummies(df, columns=['living_arrangement'], dtype=int)
    
    df_final = df_processed.reindex(columns=model_columns_final, fill_value=0)
    
    # Make Prediction
    prediction = model.predict(df_final)
    prediction_proba = model.predict_proba(df_final)
    
    # Return Response
    output = int(prediction[0])
    output_text = "Good Sleep Quality" if output == 1 else "Poor Sleep Quality"
    confidence = prediction_proba[0][output]
    
    return jsonify({
        "prediction": output, 
        "prediction_text": output_text,
        "confidence": confidence
    })

# --- 6. Run the App ---
if __name__ == '__main__':
    # Using port 5000 as a default
    app.run(host='0.0.0.0', port=5000)