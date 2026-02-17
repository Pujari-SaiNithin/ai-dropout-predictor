import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from imblearn.over_sampling import SMOTE


def load_data(csv_path: str) -> pd.DataFrame:
    return pd.read_csv(csv_path)


def prepare_features(df: pd.DataFrame):
    """
    Separate features and encode target labels
    """

    drop_cols = [
        "student_id", "full_name", "email", "register_number",
        "faculty_advisor", "hod_name",
        "college_name", "university_name"
    ]

    df = df.drop(columns=drop_cols)

    # Encode target labels
    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(df["dropout_risk"])

    X = df.drop(columns=["dropout_risk"])

    return X, y, label_encoder


def build_preprocessor():
    numerical_features = [
        "gpa", "attendance_pct", "internal_marks_avg",
        "lms_logins_per_week", "assignments_delayed",
        "library_visits_per_month", "travel_time_minutes",
        "backlogs"
    ]

    binary_features = [
        "hostel", "first_gen_student"
    ]

    categorical_features = [
        "program", "department", "section", "year"
    ]

    numeric_pipeline = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    binary_pipeline = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent"))
    ])

    categorical_pipeline = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_pipeline, numerical_features),
            ("bin", binary_pipeline, binary_features),
            ("cat", categorical_pipeline, categorical_features)
        ]
    )

    return preprocessor


def split_and_balance(X, y, test_size=0.2, random_state=42):
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=test_size,
        stratify=y,
        random_state=random_state
    )

    smote = SMOTE(random_state=random_state)
    X_train_bal, y_train_bal = smote.fit_resample(X_train, y_train)

    return X_train_bal, X_test, y_train_bal, y_test
