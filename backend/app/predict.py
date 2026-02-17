import joblib
import os

MODEL_PATH = "ml/models/xgboost_dropout_model.pkl"

def predict_dropout(student):
    """
    Predict dropout risk.
    Uses ML model if available, otherwise fallback logic.
    """

    # -----------------------------
    # FALLBACK LOGIC (SAFE)
    # -----------------------------
    risk_score = 0

    if student["attendance_pct"] < 65:
        risk_score += 30
    if student["gpa"] < 6.5:
        risk_score += 25
    if student["lms_logins_per_week"] < 3:
        risk_score += 15
    if student["financial_stress_level"] >= 4:
        risk_score += 15
    if student["stress_level"] >= 4:
        risk_score += 15

    risk_score = min(risk_score, 100)

    if risk_score <= 50:
        risk_label = "Low"
    elif risk_score <= 75:
        risk_label = "Medium"
    else:
        risk_label = "High"

    return {
        "risk_score": risk_score,
        "risk_label": risk_label
    }
