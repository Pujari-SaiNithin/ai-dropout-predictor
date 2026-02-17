import "../styles/RiskPrediction.css";
import { useState } from "react";

export default function RiskPrediction() {
  const student = JSON.parse(localStorage.getItem("student"));
  const prediction = JSON.parse(localStorage.getItem("prediction"));

  if (!student || !prediction) {
    return <div className="risk-page">Please login again.</div>;
  }

  /* =========================
     RISK META
     ========================= */
  const getRiskMeta = (score) => {
    if (score <= 50) return { label: "LOW RISK", color: "green" };
    if (score <= 75) return { label: "MEDIUM RISK", color: "yellow" };
    return { label: "HIGH RISK", color: "red" };
  };

  const risk = getRiskMeta(prediction.risk_score);

  /* =========================
     DOMINANT RISK FACTOR LOGIC
     ========================= */
  const riskFactors = [
    {
      key: "attendance",
      label: "Low Attendance",
      impact:
        student.attendance_pct < 65
          ? (65 - student.attendance_pct) * 1.2
          : 0,
    },
    {
      key: "gpa",
      label: "Low Academic Performance",
      impact: student.gpa < 6.5 ? (6.5 - student.gpa) * 10 : 0,
    },
    {
      key: "engagement",
      label: "Low Engagement",
      impact:
        student.lms_logins_per_week < 3
          ? (3 - student.lms_logins_per_week) * 8
          : 0,
    },
    {
      key: "stress",
      label: "High Stress Levels",
      impact: student.stress_level >= 4 ? student.stress_level * 3 : 0,
    },
    {
      key: "financial",
      label: "Financial Stress",
      impact:
        student.financial_stress_level >= 4
          ? student.financial_stress_level * 3
          : 0,
    },
  ];

  const dominantFactor = [...riskFactors].sort(
    (a, b) => b.impact - a.impact
  )[0];

  /* =========================
     DYNAMIC AI EXPLANATION
     ========================= */
  const generateExplanation = () => {
    if (dominantFactor.impact === 0) {
      return "The AI system finds no strong negative indicators. The student shows stable academic and behavioral patterns.";
    }

    return `The student is currently under ${risk.label.toLowerCase()} primarily due to ${dominantFactor.label.toLowerCase()}. This factor contributes more significantly to the dropout risk compared to other indicators.`;
  };

  /* =========================
     WHAT-IF (ONLY IF ATTENDANCE)
     ========================= */
  const showAttendanceWhatIf = dominantFactor.key === "attendance";

  const [simAttendance, setSimAttendance] = useState(
    student.attendance_pct
  );

  const simulateRisk = () => {
    const improvement = simAttendance - student.attendance_pct;
    const reducedRisk = Math.max(
      prediction.risk_score - improvement * 0.9,
      0
    );
    return Math.round(reducedRisk);
  };

  const simulatedRiskScore = simulateRisk();
  const simulatedRisk = getRiskMeta(simulatedRiskScore);

  return (
    <div className="risk-page">
      <h1 className="page-title">Dropout Risk Analysis</h1>

      {/* =========================
          TOP SECTION
         ========================= */}
      <div className="risk-top">

        {/* RISK SUMMARY */}
        <div className="risk-summary">
          <h3>Current Risk</h3>
          <div className={`risk-score ${risk.color}`}>
            {prediction.risk_score}%
          </div>
          <span className={`risk-badge ${risk.color}`}>
            {risk.label}
          </span>
          <p className="risk-text">{generateExplanation()}</p>
        </div>

        {/* GAUGE */}
        <div className="risk-gauge">
          <div className="gauge">
            <div
              className="needle"
              style={{
                transform: `rotate(${prediction.risk_score * 1.8 - 90}deg)`,
              }}
            />
          </div>
          <span className={`gauge-label ${risk.color}`}>
            {risk.label}
          </span>
        </div>

        {/* WHAT-IF (CONDITIONAL) */}
        <div className="whatif-box">
          <h3>Recommended Intervention</h3>

          {showAttendanceWhatIf ? (
            <>
              <p>
                AI analysis indicates <b>attendance</b> as the strongest
                contributor to dropout risk. Improving attendance may
                significantly reduce risk.
              </p>

              <label>Attendance %</label>
              <input
                type="range"
                min={student.attendance_pct}
                max="100"
                value={simAttendance}
                onChange={(e) =>
                  setSimAttendance(Number(e.target.value))
                }
              />
              <span>{simAttendance}%</span>

              <div className="whatif-result">
                <div className="whatif-card red">
                  <h4>Current Risk</h4>
                  <p>{prediction.risk_score}%</p>
                  <span>{risk.label}</span>
                </div>

                <div className="arrow">→</div>

                <div className={`whatif-card ${simulatedRisk.color}`}>
                  <h4>Simulated Risk</h4>
                  <p>{simulatedRiskScore}%</p>
                  <span>{simulatedRisk.label}</span>
                </div>
              </div>
            </>
          ) : (
            <p>
              The dominant risk factor is <b>{dominantFactor.label}</b>.
              At this stage, attendance improvement alone may not
              significantly reduce dropout risk.
            </p>
          )}
        </div>
      </div>

      {/* =========================
          RISK FACTORS
         ========================= */}
      <div className="risk-factors">
        <h3>Risk Analysis by AI</h3>
        <p className="sub">Top contributing factors</p>

        {riskFactors
          .filter((f) => f.impact > 0)
          .sort((a, b) => b.impact - a.impact)
          .map((f, i) => (
            <div key={i} className="factor-row">
              <span>{f.label}</span>
              <div className="bar">
                <div
                  className="bar-fill"
                  style={{ width: `${Math.min(f.impact, 100)}%` }}
                />
              </div>
              <span>{Math.round(f.impact)}%</span>
            </div>
          ))}
      </div>
    </div>
  );
}
