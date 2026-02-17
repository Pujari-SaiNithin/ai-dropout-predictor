"""
SAFE EXPLAINABILITY MODULE
=========================
This is a rule-based SHAP proxy used because the trained model
expects 75 features, while the app uses 11.

This PREVENTS crashes and still provides meaningful explanations.
"""

def get_shap_explanation(student: dict):
    explanations = []

    # Attendance
    if student.get("attendance_pct", 100) < 65:
        explanations.append({
            "feature": "Attendance",
            "impact": -35,
            "reason": "Low attendance significantly increases dropout risk"
        })

    # GPA
    if student.get("gpa", 10) < 6.5:
        explanations.append({
            "feature": "GPA",
            "impact": -30,
            "reason": "Low academic performance is a major risk factor"
        })

    # LMS Engagement
    if student.get("lms_logins_per_week", 10) < 3:
        explanations.append({
            "feature": "LMS Engagement",
            "impact": -15,
            "reason": "Low learning platform engagement detected"
        })

    # Stress
    if student.get("stress_level", 0) >= 4:
        explanations.append({
            "feature": "Stress Level",
            "impact": 10,
            "reason": "High stress negatively affects academic continuity"
        })

    # Financial Stress
    if student.get("financial_stress_level", 0) >= 4:
        explanations.append({
            "feature": "Financial Stress",
            "impact": 10,
            "reason": "Financial pressure may force withdrawal"
        })

    # Fallback
    if not explanations:
        explanations.append({
            "feature": "Overall Stability",
            "impact": 0,
            "reason": "No dominant risk factors detected"
        })

    return explanations
