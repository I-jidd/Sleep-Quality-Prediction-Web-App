import pandas as pd
import numpy as np
import pickle
import re
from datetime import datetime, timedelta

# --- 1. Load the Preprocessing Objects ---
try:
    with open('models/model_columns_final.pkl', 'rb') as f:
        model_columns_final = pickle.load(f)
    print("Final columns template ('model_columns_final.pkl') loaded successfully.")
except FileNotFoundError as e:
    print(f"CRITICAL ERROR: Could not load 'model_columns_final.pkl': {e}")
    model_columns_final = None
except Exception as e:
    print(f"An error occurred during object loading: {e}")


# --- 2. ORDINAL MAPPING ---
ORDINAL_MAPPING = {
    'sex': {'Female':0, 'Male':1},
    'academic_level': {'First Year':0, 'Second Year':1, 'Third Year':2, 'Fourth Year':3},
    'Caffeine_Intake_Frequency': {'Never':0, 'Almost Never':1, 'Sometimes':2, 'Fairly Often':3, 'Very Often': 4, 'Always':4},
    'screen_time_before_sleep': {'Never':0, 'less than 30 minutes':1, '30 minutes - 1 hour':2, '1 - 2 hours':3, 'More than 2 hours':4},
    'smoking_Frequency':{'Never':0, 'Almost never':1, 'Sometimes': 2, 'Fairly Often':3, 'Very Often': 4},
    'physical_activity_frequency': {'Never':0, 'Almost never':1, 'Sometimes': 2, 'Fairly Often':3, 'Very Often': 4},
    'alcohol_consumption_frequency': {'Never':0, 'Almost never':1, 'Sometimes': 2, 'Fairly Often':3, 'Very Often': 4},
    'stress_level': {'Low stress': 0, 'Moderate stress':1, 'High stress':2}
}

# this was based on training data median values
MEDIAN_NAP_DURATION = 120 
MEDIAN_LATENIGHT_HOURS = 12


# --- 4. PREPROCESSING FUNCTION ---
def preprocess_input(data):
    """
    Takes raw JSON-like data from the web form and runs
    the full preprocessing pipeline, matching the notebook.
    """
    
    # A) Convert raw JSON/dict to a DataFrame
    original_cols_order = [
        'sex', 'academic_level', 'living_arrangement', 
        'Caffeine_Intake_Frequency', 'screen_time_before_sleep',
        'smoking_Frequency', 'physical_activity_frequency',
        'alcohol_consumption_frequency', 'daytime_nap_duration',
        'latenight_study_hours', 'stress_level'
    ]
    df = pd.DataFrame([data], columns=original_cols_order)
    
    # B) Apply Ordinal Mapping (Text -> Numbers)
    for col, map_dict in ORDINAL_MAPPING.items():
        if col in df.columns:
            df[col] = df[col].map(map_dict)
    
    # C) Apply Custom Parsers (Messy Text -> Numbers)
    df['daytime_nap_duration'] = df['daytime_nap_duration'].apply(parse_nap_duration_to_minutes)
    df['latenight_study_hours'] = df['latenight_study_hours'].apply(parse_latenight_study_hours)

    # D) Apply Cap (Domain Knowledge)
    df.loc[df['daytime_nap_duration'] > 120, 'daytime_nap_duration'] = np.nan
    
    # # E) Apply Imputers with hardcoded medians from training data
    df['daytime_nap_duration'] = df['daytime_nap_duration'].fillna(MEDIAN_NAP_DURATION)
    df['latenight_study_hours'] = df['latenight_study_hours'].fillna(MEDIAN_LATENIGHT_HOURS)
    
    # F) Apply One-Hot Encoder with proper separator
    df = pd.get_dummies(df, columns=['living_arrangement'], prefix='living', prefix_sep='_', dtype=int)
    
    # G) CRITICAL: Align Columns to the Final Template
    df_final = df.reindex(columns=model_columns_final, fill_value=0)
    
    return df_final


# --- 5. Helper functions ---

def parse_nap_duration_to_minutes(s):
    """
    Parses complex duration strings into a single number (minutes).
    """
    if pd.isna(s):
        return np.nan

    s = str(s).lower().strip()

    # Handle "never" or "none" cases
    if s in ['never', 'none', 'na', '0', "i can't take naps, i have classes to attend"]:
        return 0

    # Handle the outlier sentence
    if 'during school days' in s:
        return np.nan
    
    # Strip common comments
    if ',' in s:
        if "napping too long" in s:
            s = s.split(',')[0].strip()
        s = s.replace(' max', '')

    # Handle specific string "an hour"
    if s == 'an hour' or s == '1hr' or s == '1hr.':
        return 60

    # --- Case 1: "X hours, Y mins" ---
    s_cleaned = s.replace(' and ', ', ')
    hour_match = re.search(r'(\d+\.?\d*)\s*(?:hour|hr|h)', s_cleaned)
    min_match = re.search(r'(\d+\.?\d*)\s*(?:min|m)', s_cleaned)

    if hour_match and min_match:
        try:
            hours = float(hour_match.group(1))
            mins = float(min_match.group(1))
            return (hours * 60) + mins
        except:
            pass

    # --- Case 2: Ranges (e.g., "30mins-2hrs", "1-2 hours", "7-8") ---
    s_cleaned = s.replace(' to ', '-').replace(' - ', '-').replace(' -', '-').replace('- ', '-')
    nums = re.findall(r'(\d+\.?\d*)', s_cleaned)

    if len(nums) == 2:
        try:
            n1 = float(nums[0])
            n2 = float(nums[1])

            if ('min' in s_cleaned or 'm' in s_cleaned) and ('hour' in s_cleaned or 'hr' in s_cleaned):
                val1_mins = n1
                val2_mins = n2 * 60
                return (val1_mins + val2_mins) / 2
            elif 'hour' in s_cleaned or 'hr' in s_cleaned or 'hrs' in s_cleaned:
                avg_hours = (n1 + n2) / 2
                return avg_hours * 60
            elif 'min' in s_cleaned or 'm' in s_cleaned:
                avg_mins = (n1 + n2) / 2
                return avg_mins
            else:
                return np.nan
        except:
            pass

    # --- Case 3: Single number (e.g., "5 hours", "30mins", "7", "2hrs") ---
    if len(nums) == 1:
        try:
            val = float(nums[0])
            if 'min' in s or 'm' in s:
                return val
            if 'hour' in s or 'hr' in s or 'h' in s:
                return val * 60
            if s == str(val) or s == str(int(val)):
                return np.nan
        except:
            pass 

    return np.nan

def parse_latenight_study_hours(s):
    """
    Parses complex study hour strings into a total duration (in hours).
    Handles "10pm-12am" correctly.
    """
    if pd.isna(s):
        return np.nan
    s = str(s).lower().strip()

    if s in ['yes', 'late-night', 'irregular hours', '0', 'na', '']:
        return np.nan

    if ' or ' in s:
        parts = s.split(' or ')
        durations = [parse_latenight_study_hours(part.strip()) for part in parts]
        return np.nanmax(durations) if any(pd.notna(durations)) else np.nan
    if ',' in s:
        parts = s.split(',')
        durations = [parse_latenight_study_hours(part.strip()) for part in parts]
        return np.nanmax(durations) if any(pd.notna(durations)) else np.nan

    # Robust Time Parsing Logic
    times = re.findall(r'(\d+(?::\d+)?)', s) 
    periods = re.findall(r'(am|pm)', s) 

    if len(times) == 0:
        return np.nan
    
    def parse_time(time_str, period):
        if ':' in time_str:
            t = datetime.strptime(time_str, '%H:%M')
        else:
            t = datetime.strptime(time_str, '%H')
        
        hour = t.hour
        if period == 'pm' and hour < 12:
            hour += 12
        if period == 'am' and hour == 12:
            hour = 0
        return t.replace(hour=hour)

    try:
        start_str, end_str = None, None
        start_period, end_period = None, None

        if len(times) == 2:
            start_str, end_str = times[0], times[1]
            if len(periods) == 2:
                start_period, end_period = periods[0], periods[1]
            elif len(periods) == 1:
                end_period = periods[0]
                start_period = 'pm' if end_period == 'am' else 'am'
            else:
                start_period, end_period = 'pm', 'pm' 
        
        elif len(times) == 4:
            start_str = f"{times[0]}:{times[1]}"
            end_str = f"{times[2]}:{times[3]}"
            if len(periods) == 2:
                start_period, end_period = periods[0], periods[1]
            elif len(periods) == 1:
                end_period = periods[0]
                start_period = 'pm' if end_period == 'am' else 'am'
            else:
                start_period, end_period = 'pm', 'am'

        if start_str and end_str:
            start_time = parse_time(start_str, start_period)
            end_time = parse_time(end_str, end_period)

            if end_time <= start_time:
                end_time += timedelta(days=1)
                
            duration = (end_time - start_time).total_seconds() / 3600.0
            
            return duration if duration <= 12 else np.nan
    
    except Exception as e:
        print(f"Error parsing time string '{s}': {e}")
        return np.nan

    return np.nan