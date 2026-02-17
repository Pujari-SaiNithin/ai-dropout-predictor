import joblib
import pandas as pd
import numpy as np

MODEL_PATH = "ml/models/xgboost_dropout_model.pkl"
ENCODER_PATH = "ml/models/label_encoder.pkl"


def predict_with_confidence(student_data: dict):
    """
    Predict dropout risk with confidence score
    """

    # Load trained pipeline and label encoder
    pipeline = joblib.load(MODEL_PATH)
    label_encoder = joblib.load(ENCODER_PATH)

    # Convert input to DataFrame
    df = pd.DataFrame([student_data])

    # Get probability predictions
    probabilities = pipeline.predict_proba(df)[0]

    # Get predicted class index
    predicted_index = np.argmax(probabilities)

    # Decode class label
    predicted_label = label_encoder.inverse_transform([predicted_index])[0]

    # Confidence score
    confidence = round(probabilities[predicted_index] * 100, 2)

    return {
        "predicted_risk": predicted_label,
        "confidence_score": f"{confidence}%"
    }


if __name__ == "__main__":
    # Sample student (test case)
    test_student = {
        "program": "B.Tech",
        "department": "CSE",
        "year": 3,
        "section": "A",
        "gpa": 6.2,
        "attendance_pct": 62,
        "backlogs": 2,
        "internal_marks_avg": 58,
        "lms_logins_per_week": 3,
        "assignments_delayed": 5,
        "library_visits_per_month": 1,
        "hostel": 1,
        "travel_time_minutes": 15,
        "first_gen_student": 1
    }

    result = predict_with_confidence(test_student)
    print("\nPrediction Result:")
    print(result)
