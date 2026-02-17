// src/pages/AttendanceHealth.jsx
import "../styles/AttendanceHealth.css";
import { useState } from "react";

export default function AttendanceHealth() {
  const student = JSON.parse(localStorage.getItem("student"));
  const prediction = JSON.parse(localStorage.getItem("prediction"));

  if (!student || !prediction) {
    return <div className="attendance-page">Please login again.</div>;
  }

  const attendance = student.attendance_pct;

  /* ---------------------------
     STATUS LOGIC (UNCHANGED)
  ---------------------------- */
  const getStatus = (value) => {
    if (value >= 75) return { label: "Healthy Attendance", color: "green" };
    if (value >= 65) return { label: "Irregular Attendance", color: "yellow" };
    return { label: "At Risk", color: "red" };
  };

  const currentStatus = getStatus(attendance);

  /* ---------------------------
     WHAT-IF SIMULATION
  ---------------------------- */
  const [simAttendance, setSimAttendance] = useState(attendance);

  const simulateRisk = () => {
    const improvement = simAttendance - attendance;
    return Math.max(Math.round(prediction.risk_score - improvement * 0.8), 0);
  };

  const simulatedRisk = simulateRisk();
  const riskReduced = prediction.risk_score - simulatedRisk;

  return (
    <div className="attendance-page">
      <h1 className="page-title">Attendance Health</h1>

      <div className="attendance-grid">

        {/* ================= LEFT PANEL ================= */}
        <div className="attendance-card">

          <h3>Attendance Score</h3>

          <div className={`attendance-value ${currentStatus.color}`}>
            {attendance.toFixed(2)}%
          </div>

          <span className={`status-badge ${currentStatus.color}`}>
            {currentStatus.label}
          </span>

          {/* -------- SEGMENTED BAR (REALISTIC) -------- */}
          <div className="segmented-bar">
            <div className="segment green">≥ 75%</div>
            <div className="segment yellow">65–74%</div>
            <div className="segment red">&lt; 65%</div>

            {/* Markers */}
            <div
              className="marker current"
              style={{ left: `${attendance}%` }}
            />
            <div
              className="marker simulated"
              style={{ left: `${simAttendance}%` }}
            />
          </div>

          <div className="legend">
            <span><b>●</b> Current</span>
            <span><b>●</b> Simulated</span>
          </div>

          {/* -------- AI EXPLANATION -------- */}
          <div className="info-box">
            <h4>AI Explanation</h4>
            <p>
              {attendance >= 75 &&
                "The student maintains attendance above the recommended academic threshold, indicating strong engagement and reduced dropout risk."}

              {attendance >= 65 && attendance < 75 &&
                "Attendance patterns are slightly inconsistent and may begin to affect academic continuity if not improved."}

              {attendance < 65 &&
                "Attendance is below the safe threshold, which significantly increases dropout risk according to the AI model."}
            </p>
          </div>

          <div className="info-box">
            <h4>Risk Impact</h4>
            <p>
              Attendance below <b>75%</b> is statistically associated with disengagement and academic difficulty.
              Improving attendance can significantly reduce dropout risk.
            </p>
          </div>
        </div>

        {/* ================= WHAT-IF CARD ================= */}
        <div className="whatif-container">
          <h3>Recommended Intervention</h3>

          <p className="whatif-desc">
            AI analysis identifies <b>attendance</b> as the strongest contributor
            to dropout risk. Improving attendance may significantly reduce risk.
          </p>

          <div className="slider-block">
            <label>Attendance %</label>
            <input
              type="range"
              min={attendance}
              max="100"
              value={simAttendance}
              onChange={(e) => setSimAttendance(Number(e.target.value))}
            />
            <span className="slider-value">
              {simAttendance.toFixed(2)}%
            </span>
          </div>

          <div className="risk-compare-row">
            <div className="risk-box red">
              <h4>Current Risk</h4>
              <h2>{prediction.risk_score}%</h2>
            </div>

            <div className="arrow">→</div>

            <div className="risk-box yellow">
              <h4>Simulated Risk</h4>
              <h2>{simulatedRisk}%</h2>
            </div>
          </div>

          <p className="reduction">
            Risk reduced by <b>{riskReduced}%</b>
          </p>
        </div>

      </div>
    </div>
  );
}
