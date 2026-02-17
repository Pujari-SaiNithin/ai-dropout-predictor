import pandas as pd
import joblib
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report

# -----------------------------
# LOAD DATASET
# -----------------------------
df = pd.read_csv("ml/data/ai_dropout_predictor_dataset.csv")

# -----------------------------
# TARGET
# -----------------------------
y = df["dropout_risk"]

# -----------------------------
# FEATURES (REMOVE IDENTIFIERS)
# -----------------------------
X = df.drop([
    "student_id",
    "full_name",
    "email",
    "register_number",
    "faculty_advisor",
    "hod_name",
    "college_name",
    "university_name",
    "dropout_risk"
], axis=1)

# -----------------------------
# ENCODE FEATURES
# -----------------------------
X = pd.get_dummies(X)

# -----------------------------
# ENCODE TARGET
# -----------------------------
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# -----------------------------
# TRAIN / TEST SPLIT (STRATIFIED)
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)

# -----------------------------
# MODEL (BALANCED & STABLE)
# -----------------------------
model = XGBClassifier(
    n_estimators=300,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="multi:softprob",
    eval_metric="mlogloss",
    random_state=42
)

model.fit(X_train, y_train)

# -----------------------------
# EVALUATION
# -----------------------------
y_pred = model.predict(X_test)
print(
    classification_report(
        y_test,
        y_pred,
        target_names=label_encoder.classes_
    )
)

# -----------------------------
# SAVE MODEL
# -----------------------------
joblib.dump(model, "ml/models/xgboost_dropout_model.pkl")
joblib.dump(label_encoder, "ml/models/label_encoder.pkl")

print("✅ Model training complete & saved")
