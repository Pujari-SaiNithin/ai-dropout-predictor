from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ✅ RELATIVE IMPORTS (CORRECT)
from .database import get_student_by_email
from .auth import verify_login
from .predict import predict_dropout
from .shap_explain import get_shap_explanation
from .academic_review import generate_academic_review

app = FastAPI()

# ---------------------------
# CORS
# ---------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# SCHEMAS
# ---------------------------
class LoginRequest(BaseModel):
    email: str
    password: str

class SimulateRequest(BaseModel):
    email: str
    new_attendance: float


# ---------------------------
# LOGIN
# ---------------------------
@app.post("/login")
def login(data: LoginRequest):
    if not verify_login(data.email, data.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    student = get_student_by_email(data.email)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    prediction = predict_dropout(student)

    return {
        "student": student,
        "prediction": prediction
    }

# ---------------------------
# SHAP EXPLANATION (SAFE)
# ---------------------------
@app.post("/shap")
def shap_explain(data: dict):
    email = data.get("email")

    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    student = get_student_by_email(email)

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    return {
        "shap": get_shap_explanation(student)
    }
# ---------------------------
# ATTENDANCE WHAT-IF SIMULATION (FINAL & WORKING)
# ---------------------------
@app.post("/simulate")
def simulate_attendance(data: SimulateRequest):
    student = get_student_by_email(data.email)

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Clone student
    simulated_student = student.copy()
    simulated_student["attendance_pct"] = data.new_attendance

    prediction = predict_dropout(simulated_student)

    return {
        "current_attendance": student["attendance_pct"],
        "new_attendance": data.new_attendance,
        "simulated_risk_score": prediction["risk_score"],
        "simulated_risk_label": prediction["risk_label"]
    }
@app.post("/academic-review")
def academic_review(data: dict):
    email = data.get("email")

    student = get_student_by_email(email)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    prediction = predict_dropout(student)

    review = generate_academic_review(student, prediction)

    return review
