import pandas as pd
import numpy as np
import re
from datetime import datetime, timedelta

# --- 1. PARSER FUNCTIONS ---

def parse_nap_duration_to_minutes(s):
    """
    Parses complex duration strings into a single number (minutes).
    """
    if pd.isna(s):
        return np.nan

    s = str(s).lower().strip()

    # Handle "never" or "none"
    if s in ['never', 'none', 'na', '0']:
        return 0

    # Handle specific string "an hour"
    if s == 'an hour':
        return 60

    # Handle the outlier sentence
    if 'during school days' in s:
        return np.nan

    # --- Case 1: "X hours, Y mins" ---
    hour_match = re.search(r'(\d+\.?\d*)\s*(?:hour|hr|h|hrs)', s)
    min_match = re.search(r'(\d+\.?\d*)\s*(?:min|m|mins)', s)

    if hour_match and min_match:
        try:
            hours = float(hour_match.group(1))
            mins = float(min_match.group(1))
            return (hours * 60) + mins
        except:
            pass

    # --- Case 2: Ranges (e.g., "30mins-2hrs", "1-2 hours", "7-8") ---
    nums = re.findall(r'(\d+\.?\d*)', s)

    if len(nums) == 2:
        try:
            n1 = float(nums[0])
            n2 = float(nums[1])

            # Check for mixed units: "30mins to 1hour" or "30mins-2hrs"
            if ('min' in s or 'm' in s) and ('hour' in s or 'hr' in s):
                val1_mins = n1
                val2_mins = n2 * 60
                return (val1_mins + val2_mins) / 2

            # Check for hours-only range: "2-3 hours", "3-5hrs", "1-2 hrs"
            elif 'hour' in s or 'hr' in s or 'hrs' in s:
                avg_hours = (n1 + n2) / 2
                return avg_hours * 60

            # Check for mins-only range: "20-30 mins"
            elif 'min' in s or 'm' in s:
                avg_mins = (n1 + n2) / 2
                return avg_mins

            # Check for ambiguous range: "7-8" (assume hours)
            else:
                avg_hours = (n1 + n2) / 2
                return avg_hours * 60
        except:
            pass

    # --- Case 3: Single number (e.g., "5 hours", "30mins", "7", "2hrs") ---
    if len(nums) >= 1:
        try:
            val = float(nums[0])

            # Check if it's minutes
            if 'min' in s or 'm' in s:
                return val

            # Default to hours
            else:
                return val * 60
        except:
            pass

    return np.nan

def parse_latenight_study_end_hour(s):
    """
    Parses study hour strings and returns the END HOUR as a float.
    Examples: "10:00PM-1:00AM" -> 1.0, "8-10pm" -> 22.0
    """
    if pd.isna(s) or not s:
        return None
    
    s = str(s).lower().strip()
    
    # Handle non-time entries
    if s in ['yes', 'late-night', 'irregular hours', '0', 'na']:
        return None
    
    # Handle "or" and "," by finding the latest end time
    if ' or ' in s:
        parts = s.split(' or ')
        end_hours = [parse_latenight_study_end_hour(part.strip()) for part in parts]
        valid_hours = [h for h in end_hours if h is not None]
        return max(valid_hours) if valid_hours else None
    
    if ',' in s:
        parts = s.split(',')
        end_hours = [parse_latenight_study_end_hour(part.strip()) for part in parts]
        valid_hours = [h for h in end_hours if h is not None]
        return max(valid_hours) if valid_hours else None
    
    # Find time numbers
    times = re.findall(r'(\d+(?::\d+)?)', s)
    
    if len(times) == 0:
        return None
    if len(times) == 1:
        return None
    
    if len(times) == 2:
        try:
            start_str = times[0]
            end_str = times[1]
            
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
                
                return t.replace(hour=hour % 24)
            
            # Determine AM/PM
            start_period = 'am' if 'am' in s.split('-')[0] else ('pm' if 'pm' in s.split('-')[0] else 'unknown')
            end_period = 'am' if 'am' in s else 'pm'
            
            start_hour_val = float(start_str.split(':')[0])
            
            if start_period == 'unknown':
                if end_period == 'pm':
                    start_period = 'pm'
                elif end_period == 'am':
                    start_period = 'pm'
            
            if 'am' in s.split('-')[0] and 'am' in s:
                start_period = 'am'
                end_period = 'am'
            
            if 'pm' in s.split('-')[0] and 'pm' in s:
                start_period = 'pm'
                end_period = 'pm'
            
            start_time = parse_time(start_str, start_period)
            end_time = parse_time(end_str, end_period)
            
            return end_time.hour + (end_time.minute / 60.0)
        
        except Exception as e:
            return None
    
    # Fallback for "11:30 - 1:30"
    if len(times) == 4:
        try:
            start_str = f"{times[0]}:{times[1]}"
            end_str = f"{times[2]}:{times[3]}"
            return parse_latenight_study_end_hour(f"{start_str}-{end_str} {s}")
        except:
            return None
    
    return None

def parse_latenight_study_hours(s):
    """
    Parses complex study hour strings into a single feature: the END HOUR.
    e.g., "10:00PM-1:00AM" -> 1.0
    e.g., "8-10pm" -> 22.0
    e.g., "8pm - 11pm or 3am to 5am" -> 5.0 (returns the latest one)
    """
    s = str(s).lower().strip()
    
    # Handle non-time entries
    if s in ['yes', 'late-night', 'irregular hours', '0', 'na']:
        return None
    
    # Handle "or" and "," by finding the latest end time
    if ' or ' in s:
        parts = s.split(' or ')
        end_hours = [parse_latenight_study_hours(part.strip()) for part in parts]
        return np.nanmax(end_hours) if any(pd.notna(end_hours)) else None
    
    if ',' in s:
        parts = s.split(',')
        end_hours = [parse_latenight_study_hours(part.strip()) for part in parts]
        return np.nanmax(end_hours) if any(pd.notna(end_hours)) else None
    
    # Find time numbers
    times = re.findall(r'(\d+(?::\d+)?)', s)
    
    if len(times) == 0:
        return None
    if len(times) == 1:
        return None
    
    if len(times) == 2:
        try:
            start_str = times[0]
            end_str = times[1]
            
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
                
                return t.replace(hour=hour % 24)
            
            # Determine AM/PM
            start_period = 'am' if 'am' in s.split('-')[0] else ('pm' if 'pm' in s.split('-')[0] else 'unknown')
            end_period = 'am' if 'am' in s else 'pm'
            
            start_hour_val = float(start_str.split(':')[0])
            
            if start_period == 'unknown':
                if end_period == 'pm':
                    start_period = 'pm'
                elif end_period == 'am':
                    start_period = 'pm'
            
            if 'am' in s.split('-')[0] and 'am' in s:
                start_period = 'am'
                end_period = 'am'
            
            if 'pm' in s.split('-')[0] and 'pm' in s:
                start_period = 'pm'
                end_period = 'pm'
            
            start_time = parse_time(start_str, start_period)
            end_time = parse_time(end_str, end_period)
            
            return end_time.hour + (end_time.minute / 60.0)
        
        except Exception as e:
            return None
    
    # Fallback for "11:30 - 1:30"
    if len(times) == 4:
        try:
            start_str = f"{times[0]}:{times[1]}"
            end_str = f"{times[2]}:{times[3]}"
            return parse_latenight_study_hours(f"{start_str}-{end_str} {s}")
        except:
            return None
    
    return None

# --- 2. ORDINAL MAPPING ---
ORDINAL_MAPPING = {
    'sex': {'Female':0, 'Male':1},
    'academic_level': {'First Year':0, 'Second Year':1, 'Third Year':2, 'Fourth Year':3},
    'Caffeine_Intake_Frequency': {'Never':0, 'Almost Never':1, 'Sometimes':2, 'Fairly Often':3, 'Very Often': 4, 'Always':4},
    'screen_time_before_sleep': {'Never':0, 'less than 30 minutes':1, '30 minutes - 1 hour':2, '1 - 2 hours':3, 'More than 2 hours':4},
    'smoking_Frequency':{'Never':0, 'Almost never':1, 'Sometimes': 2, 'Fairly Often':3, 'Very Often': 4},
    'physical_activity_frequency': {'Never':0, 'Almost never':1, 'Sometimes': 2, 'Fairly Often':3, 'Very Often': 4},
    'alcohol_consumption_frequency': {'Never':0, 'Almost never':1, 'Sometimes': 2, 'Fairly Often':3, 'Very Often': 4},
    'stress_level': {'low stress': 0, 'moderate stress':1, 'high stress':2}
}

# --- 3. MASTER PREPROCESSING FUNCTION ---
def preprocess_input(data, initial_columns, final_columns):
    """
    Takes raw JSON-like data and runs the full pipeline.
    Returns a final, aligned DataFrame ready for prediction.
    """
    
    # A) Convert to DataFrame using the initial column list
    df = pd.DataFrame([data], columns=initial_columns)
    
    # B) Apply Ordinal Mapping
    for col, map_dict in ORDINAL_MAPPING.items():
        df[col] = df[col].map(map_dict)
        
    # C) Apply Custom Parsers & Capping
    df['daytime_nap_duration_minutes'] = df['daytime_nap_duration'].apply(parse_nap_duration_to_minutes)
    df.loc[df['daytime_nap_duration_minutes'] > 120, 'daytime_nap_duration_minutes'] = np.nan
    
    df['latenight_study_hours_duration'] = df['latenight_study_hours'].apply(parse_latenight_study_hours)
    
    # D) Impute NaNs (using the trained medians)
    # (For a single prediction, it's safer to fill with 0 or a known median)
    df['daytime_nap_duration_minutes'] = df['daytime_nap_duration_minutes'].fillna(60.0) # e.g., 60 min median
    df['latenight_study_hours_duration'] = df['latenight_study_hours_duration'].fillna(3.0) # e.g., 3 hour median
    
    # E) One-Hot Encode
    df_processed = pd.get_dummies(df, columns=['living_arrangement'], dtype=int)
    
    # F) CRITICAL: Align Columns
    df_final = df_processed.reindex(columns=final_columns, fill_value=0)
    
    return df_final