def generate_academic_review(student, prediction):
    """
    Generates structured AI academic review
    """

    review = {}

    risk_score = prediction["risk_score"]

    # =============================
    # Academic Health Status
    # =============================
    if risk_score <= 50:
        health_status = "Stable"
    elif risk_score <= 75:
        health_status = "Needs Attention"
    else:
        health_status = "Critical"

    review["health_status"] = health_status

    # =============================
    # Narrative Summary
    # =============================
    reasons = []

    if student["attendance_pct"] < 65:
        reasons.append("irregular attendance")
    if student["gpa"] < 6.5:
        reasons.append("low academic performance")
    if student["assignments_delayed"] > 2:
        reasons.append("frequent assignment delays")
    if student["stress_level"] >= 4:
        reasons.append("elevated stress levels")
    if student["financial_stress_level"] >= 4:
        reasons.append("financial pressure")

    if not reasons:
        summary = (
            "The student demonstrates stable academic and behavioral patterns "
            "with no significant negative indicators detected by the AI system."
        )
    else:
        summary = (
            "The AI analysis indicates that the student’s academic health is influenced by "
            + ", ".join(reasons)
            + ". These factors collectively contribute to the current risk profile."
        )

    review["summary"] = summary

    # =============================
    # Pillar Breakdown
    # =============================
    review["pillars"] = {
        "attendance": {
            "value": student["attendance_pct"],
            "status": "Good" if student["attendance_pct"] >= 75 else "Concern"
        },
        "academics": {
            "value": student["gpa"],
            "status": "Good" if student["gpa"] >= 7 else "Concern"
        },
        "engagement": {
            "value": student["lms_logins_per_week"],
            "status": "Active" if student["lms_logins_per_week"] >= 3 else "Low"
        },
        "wellbeing": {
            "value": student["stress_level"],
            "status": "Stable" if student["stress_level"] < 4 else "High Stress"
        }
    }

    # =============================
    # Top Concerns Ranking
    # =============================
    concerns = []

    if student["attendance_pct"] < 65:
        concerns.append("Attendance irregularity")
    if student["assignments_delayed"] > 2:
        concerns.append("Assignment submission delays")
    if student["stress_level"] >= 4:
        concerns.append("High stress levels")

    review["top_concerns"] = concerns

    # =============================
    # AI Confidence
    # =============================
    review["confidence"] = "High"

    return review
