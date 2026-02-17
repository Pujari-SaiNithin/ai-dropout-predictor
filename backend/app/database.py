import pandas as pd
import os

# Absolute paths (VERY IMPORTANT)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))

DATA_PATH = os.path.join(
    PROJECT_ROOT,
    "ml",
    "data",
    "ai_dropout_predictor_dataset.csv"
)

if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"Dataset not found at: {DATA_PATH}")

df = pd.read_csv(DATA_PATH)

def get_student_by_email(email: str):
    student = df[df["email"] == email]
    if student.empty:
        return None
    return student.iloc[0].to_dict()
