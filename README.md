# AI Dropout Predictor

> AI-Powered Academic Risk Analytics Platform for Early Dropout Detection

---

## Overview

AI Dropout Predictor is a full-stack machine learning system designed to identify students at risk of academic dropout using academic, behavioral, and engagement data.

The platform provides:

-  Dropout Risk Prediction (XGBoost)
-  Explainable AI (SHAP Analysis)
-  Attendance & Engagement Analytics
-  What-If Risk Simulation
-  Professional AI Dashboard (React + FastAPI)

This system enables institutions to detect risk early and take proactive intervention measures.

---

##  Key Features

### 1️ Overall Dropout Risk
- Risk Score (0–100%)
- Categorized into:
  -  Low Risk
  -  Medium Risk
  -  High Risk
- AI-generated explanation

---

### 2️ AI-Powered Academic Review
Analyzes:
- GPA
- Attendance
- LMS Usage
- Stress Levels
- Financial Stress
- Assignment Delays

Provides structured AI interpretation of academic health.

---

### 3️ Attendance Health Monitoring
- ≥ 75% → Healthy
- 65–74% → Irregular
- < 65% → At Risk
- What-if simulation to test risk reduction

---

### 4️ Engagement Intelligence
Calculates engagement score using:
- LMS logins/week
- Library visits/month
- Assignment behavior

---

### 5️ Explainable AI (SHAP)
Displays feature-level impact on risk prediction for transparency.

---

##  System Architecture

```
React Frontend
        ↓
FastAPI Backend
        ↓
XGBoost ML Model
        ↓
SHAP Explainability Engine
```

---

##  Tech Stack

### Frontend
- React (Vite)
- Custom CSS Dashboard
- LocalStorage Session Handling

### Backend
- FastAPI
- Uvicorn
- REST API

### Machine Learning
- XGBoost
- Scikit-learn
- SHAP
- NumPy
- Pandas
- Joblib

### Deployment
- GitHub
- Render (Backend)
- Frontend ready for Vercel / Netlify

---

##  Project Structure

```
ai-dropout-predictor/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│
├── ml/
│
└── README.md
```

---

##  Local Setup

### Clone Repository

```bash
git clone https://github.com/Pujari-SaiNithin/ai-dropout-predictor.git
cd ai-dropout-predictor
```

---

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at:
```
http://127.0.0.1:8000
```

API Docs:
```
http://127.0.0.1:8000/docs
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

---

## 🎯 Use Case

This platform is designed for:

- Universities
- Colleges
- Academic Advisors
- Student Success Teams

It enables data-driven early intervention strategies.

---

##  Future Improvements

- College database integration
- Multi-student dashboard
- Admin control panel
- PDF report export
- AI Chatbot advisor
- JWT-based authentication

---

## 👨‍💻 Author

**Sai Nithin Pujari**  
AI & Full Stack Developer  

GitHub:  
https://github.com/Pujari-SaiNithin

---

##  Project Goal

To build a production-ready AI academic analytics platform combining:

- Machine Learning
- Explainable AI
- Full-Stack Engineering
- Professional UI/UX

---

