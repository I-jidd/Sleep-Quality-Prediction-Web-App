from flask import Flask
import numpy as np
import pickle

app = Flask(__name__)


@app.route('/')
def home():
    test_input = np.array([1,2,2,4,0,1,4,60,11,1,0,0,0,1]).reshape(1, -1)
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    prediction = model.predict(test_input)
    if prediction == 0:
        prediction = "Poor Sleep Quality"
    else:
        prediction = "Good Sleep Quality"
    return prediction