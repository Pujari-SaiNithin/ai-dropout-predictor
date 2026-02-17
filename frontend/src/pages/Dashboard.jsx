import "../styles/dashboard.css";
import { useState } from "react";

export default function Dashboard() {
  const student = JSON.parse(localStorage.getItem("student"));
  const prediction = JSON.parse(localStorage.getItem("prediction"));

  const [activeSection, setActiveSection] = useState(null);
  const [shapData, setShapData] = useState([]);
  const [simAttendance, setSimAttendance] = useState(student.attendance_pct);
const [simResult, setSimResult] = useState(null);
const [simLoading, setSimLoading] = useState(false);


  if (!student || !prediction) {
    return <div className="dashboard">Please login again.</div>;
  }

  /* =========================
     FINAL RISK LOGIC
     ========================= */
  const getRiskFromScore = (score) => {
    if (score <= 50) {
      return { level: "Low Risk", color: "green" };
    } else if (score <= 75) {
      return { level: "Medium Risk", color: "yellow" };
    } else {
      return { level: "High Risk", color: "red" };
    }
  };

  const risk = getRiskFromScore(prediction.risk_score);

  /* =========================
     ATTENDANCE LOGIC
     ========================= */
  const getAttendanceStatus = (attendance) => {
    if (attendance >= 65) {
      return { label: "Good Attendance", color: "green" };
    } else {
      return { label: "Poor Attendance", color: "red" };
    }
  };

  const attendance = getAttendanceStatus(student.attendance_pct);

  /* =========================
     AI INSIGHT (REAL OUTPUT)
     ========================= */
  const generateInsight = () => {
    let reasons = [];

    if (student.gpa < 6.5) reasons.push("low academic performance");
    if (student.attendance_pct < 65) reasons.push("irregular attendance");
    if (student.lms_logins_per_week < 3) reasons.push("low LMS engagement");
    if (student.financial_stress_level >= 4) reasons.push("financial stress");
    if (student.stress_level >= 4) reasons.push("high stress levels");

    if (reasons.length === 0) {
      return "AI analysis indicates stable academic performance and healthy engagement patterns.";
    }

    return `AI analysis suggests the student's dropout risk is influenced by ${reasons.join(", ")}.`;
  };

  const aiInsightText = generateInsight();

  /* =========================
     SHAP FETCH (NEW – SAFE)
     ========================= */
  const fetchShapExplanation = async () => {
    try {
      const res = await fetch("http://localhost:8000/shap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });

      const data = await res.json();
      setShapData(data.shap || []);
    } catch (err) {
      console.error("SHAP fetch failed", err);
    }
  };

const runSimulation = async () => {
  setSimLoading(true);

  try {
    const res = await fetch("http://localhost:8000/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: student.email,          // ✅ REQUIRED
        new_attendance: simAttendance  // ✅ REQUIRED
      }),
    });

    if (!res.ok) {
      throw new Error("Simulation API failed");
    }

    const data = await res.json();
    setSimResult(data);
  } catch (err) {
    console.error("Simulation failed", err);
  } finally {
    setSimLoading(false);
  }
};



  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      {/* =========================
          TOP ROW
         ========================= */}
      <div className="card-grid">

        <div className="card blue" onClick={() => setActiveSection("review")}>
          <h3>AI-Powered Academic Review</h3>
          <p>Comprehensive analysis using academic & behavioral data</p>
          <button>View AI Review →</button>
        </div>

        <div
          className={`card ${risk.color}`}
          onClick={() => setActiveSection("risk")}
        >
          <h3>Overall Dropout Risk</h3>
          <h2>{risk.level}</h2>
          <p>Estimated Risk Score: {prediction.risk_score}%</p>
          <button>View Risk Analysis →</button>
        </div>

        <div
          className={`card ${attendance.color}`}
          onClick={() => setActiveSection("attendance")}
        >
          <h3>Attendance Health</h3>
          <h2>{student.attendance_pct}%</h2>
          <p>{attendance.label}</p>
          <button>View Attendance →</button>
        </div>

      </div>

      {/* =========================
          SECOND ROW
         ========================= */}
      <div className="card-grid">

        <div className="card dark" onClick={() => setActiveSection("engagement")}>
          <h3>Engagement Level</h3>
          <h2>
            {student.lms_logins_per_week < 3
              ? "Low Engagement"
              : "Active Engagement"}
          </h2>
          <p>Learning platform & library usage</p>
          <button>View Engagement →</button>
        </div>

        <div className="card dark" onClick={() => setActiveSection("insight")}>
          <h3>AI Insight Summary</h3>
          <p>{aiInsightText}</p>
          <button>View Insights →</button>
        </div>

        {/* 🔥 SHAP TRIGGER ADDED */}
        <div
          className="card red"
          onClick={() => {
            setActiveSection("features");
            fetchShapExplanation();
          }}
        >
          <h3>Key Risk Contributors</h3>
          <p>Primary factors affecting risk score</p>
          <button>View Factors →</button>
        </div>

      </div>

      {/* =========================
          DETAIL SECTION
         ========================= */}
      {activeSection && (
        <div className="details-section">

          {activeSection === "review" && (
            <>
              <h2>AI-Powered Academic Review</h2>
              <p>
                The AI system evaluates academic performance, attendance patterns,
                engagement metrics, and stress indicators to assess the student’s
                overall academic health.
              </p>
              <p>
                Current evaluation places the student under
                <b> {risk.level}</b> with a calculated risk score of
                <b> {prediction.risk_score}%</b>.
              </p>
            </>
          )}

          {activeSection === "risk" && (
            <>
  <h2>Risk Analysis</h2>

  <p>
    Current Risk Level: <b>{risk.level}</b>
  </p>
  <p>
    Current Risk Score: <b>{prediction.risk_score}%</b>
  </p>

  <hr />

  <h3>What-If Simulation</h3>
  <p>Adjust attendance to preview risk reduction</p>

  {/* SLIDER */}
  <input
    type="range"
    min={student.attendance_pct}
    max="100"
    value={simAttendance}
    onChange={(e) => setSimAttendance(Number(e.target.value))}
  />
  <p>Simulated Attendance: <b>{simAttendance}%</b></p>

  {/* BUTTON */}
  <button onClick={runSimulation} disabled={simLoading}>
    {simLoading ? "Simulating..." : "Simulate"}
  </button>

  {/* RESULT */}
  {simResult && (
    <div style={{ marginTop: "20px" }}>
      <p style={{ color: "#22c55e" }}>
        Risk reduced by{" "}
        <b>{prediction.risk_score - simResult.simulated_risk_score}%</b>
      </p>

      <div style={{ display: "flex", gap: "20px" }}>
        <div className="risk-box red">
          <h4>Current Risk</h4>
          <h2>{prediction.risk_score}%</h2>
        </div>

        <div className="risk-box yellow">
          <h4>New Simulated Risk</h4>
          <h2>{simResult.simulated_risk_score}%</h2>
        </div>
      </div>
    </div>
  )}
</>

          )}

          {activeSection === "attendance" && (
            <>
              <h2>Attendance Details</h2>
              <p>Attendance Percentage: {student.attendance_pct}%</p>
              <p>
                Students with attendance below 65% are statistically more likely
                to experience academic difficulties.
              </p>
            </>
          )}

          {activeSection === "engagement" && (
            <>
              <h2>Engagement Details</h2>
              <p>LMS Logins per Week: {student.lms_logins_per_week}</p>
              <p>Library Visits per Month: {student.library_visits_per_month}</p>
            </>
          )}

          {activeSection === "insight" && (
            <>
              <h2>AI Insight Summary</h2>
              <p>{aiInsightText}</p>
            </>
          )}

          {/* 🔥 SHAP EXPLANATION ADDED BELOW EXISTING LIST */}
          {activeSection === "features" && (
            <>
              <h2>Key Risk Contributors</h2>
              <ul>
                <li>GPA: {student.gpa}</li>
                <li>Attendance: {student.attendance_pct}%</li>
                <li>Stress Level: {student.stress_level}</li>
                <li>Financial Stress: {student.financial_stress_level}</li>
                <li>LMS Engagement: {student.lms_logins_per_week} logins/week</li>
              </ul>

              <h3 style={{ marginTop: "20px" }}>
                Explainable AI (SHAP Analysis)
              </h3>

              {shapData.length === 0 ? (
                <p>Loading explanation...</p>
              ) : (
                shapData.map((item, index) => (
                  <div key={index} style={{ marginBottom: "12px" }}>
                    <strong>{item.feature}</strong>
                    <div
                      style={{
                        height: "10px",
                        width: `${Math.min(Math.abs(item.impact), 100)}%`,
                        backgroundColor:
                          item.impact >= 0 ? "#b91c1c" : "#15803d",
                        borderRadius: "6px",
                        marginTop: "4px",
                      }}
                    />
                    <small>
                      {item.impact >= 0
                        ? "Increases dropout risk"
                        : "Reduces dropout risk"}
                    </small>
                  </div>
                ))
              )}
            </>
          )}

        </div>
      )}
    </div>
  );
}
// import "../styles/dashboard.css";
// import { useState } from "react";

// export default function Dashboard() {
//   const student = JSON.parse(localStorage.getItem("student"));
//   const prediction = JSON.parse(localStorage.getItem("prediction"));

//   const [activeSection, setActiveSection] = useState(null);
//   const [shapData, setShapData] = useState([]);
//   const [simAttendance, setSimAttendance] = useState(student.attendance_pct);
//   const [simResult, setSimResult] = useState(null);
//   const [simLoading, setSimLoading] = useState(false);

//   // 🔥 NEW — Academic Review state
//   const [reviewData, setReviewData] = useState(null);
//   const [reviewLoading, setReviewLoading] = useState(false);

//   if (!student || !prediction) {
//     return <div className="dashboard">Please login again.</div>;
//   }

//   /* =========================
//      RISK LOGIC
//      ========================= */
//   const getRiskFromScore = (score) => {
//     if (score <= 50) return { level: "Low Risk", color: "green" };
//     if (score <= 75) return { level: "Medium Risk", color: "yellow" };
//     return { level: "High Risk", color: "red" };
//   };

//   const risk = getRiskFromScore(prediction.risk_score);

//   /* =========================
//      ATTENDANCE LOGIC
//      ========================= */
//   const getAttendanceStatus = (attendance) => {
//     if (attendance >= 65)
//       return { label: "Good Attendance", color: "green" };
//     return { label: "Poor Attendance", color: "red" };
//   };

//   const attendance = getAttendanceStatus(student.attendance_pct);

//   /* =========================
//      AI INSIGHT
//      ========================= */
//   const generateInsight = () => {
//     let reasons = [];

//     if (student.gpa < 6.5) reasons.push("low academic performance");
//     if (student.attendance_pct < 65) reasons.push("irregular attendance");
//     if (student.lms_logins_per_week < 3)
//       reasons.push("low LMS engagement");
//     if (student.financial_stress_level >= 4)
//       reasons.push("financial stress");
//     if (student.stress_level >= 4)
//       reasons.push("high stress levels");

//     if (reasons.length === 0) {
//       return "AI analysis indicates stable academic performance and healthy engagement patterns.";
//     }

//     return `AI analysis suggests the student's dropout risk is influenced by ${reasons.join(
//       ", "
//     )}.`;
//   };

//   const aiInsightText = generateInsight();

//   /* =========================
//      SHAP FETCH
//      ========================= */
//   const fetchShapExplanation = async () => {
//     try {
//       const res = await fetch("http://localhost:8000/shap", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(student),
//       });

//       const data = await res.json();
//       setShapData(data.shap || []);
//     } catch (err) {
//       console.error("SHAP fetch failed", err);
//     }
//   };

//   /* =========================
//      WHAT-IF SIMULATION
//      ========================= */
//   const runSimulation = async () => {
//     setSimLoading(true);

//     try {
//       const res = await fetch("http://localhost:8000/simulate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: student.email,
//           new_attendance: simAttendance,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error("Simulation API failed");
//       }

//       const data = await res.json();
//       setSimResult(data);
//     } catch (err) {
//       console.error("Simulation failed", err);
//     } finally {
//       setSimLoading(false);
//     }
//   };

//   /* =========================
//      🔥 ACADEMIC REVIEW FETCH
//      ========================= */
//   const fetchAcademicReview = async () => {
//     setReviewLoading(true);

//     try {
//       const res = await fetch("http://localhost:8000/academic-review", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: student.email }),
//       });

//       if (!res.ok) {
//         throw new Error("Review API failed");
//       }

//       const data = await res.json();
//       setReviewData(data);
//     } catch (err) {
//       console.error("Academic review failed", err);
//     } finally {
//       setReviewLoading(false);
//     }
//   };

//   return (
//     <div className="dashboard">
//       <h1 className="page-title">Dashboard</h1>

//       {/* ================= TOP ROW ================= */}
//       <div className="card-grid">

//         {/* 🔥 UPDATED CARD */}
//         <div
//           className="card blue"
//           onClick={() => {
//             setActiveSection("review");
//             fetchAcademicReview();
//           }}
//         >
//           <h3>AI-Powered Academic Review</h3>
//           <p>Comprehensive analysis using academic & behavioral data</p>
//           <button>View AI Review →</button>
//         </div>

//         <div
//           className={`card ${risk.color}`}
//           onClick={() => setActiveSection("risk")}
//         >
//           <h3>Overall Dropout Risk</h3>
//           <h2>{risk.level}</h2>
//           <p>Estimated Risk Score: {prediction.risk_score}%</p>
//           <button>View Risk Analysis →</button>
//         </div>

//         <div
//           className={`card ${attendance.color}`}
//           onClick={() => setActiveSection("attendance")}
//         >
//           <h3>Attendance Health</h3>
//           <h2>{student.attendance_pct}%</h2>
//           <p>{attendance.label}</p>
//           <button>View Attendance →</button>
//         </div>
//       </div>

//       {/* ================= SECOND ROW ================= */}
//       <div className="card-grid">

//         <div
//           className="card dark"
//           onClick={() => setActiveSection("engagement")}
//         >
//           <h3>Engagement Level</h3>
//           <h2>
//             {student.lms_logins_per_week < 3
//               ? "Low Engagement"
//               : "Active Engagement"}
//           </h2>
//           <p>Learning platform & library usage</p>
//           <button>View Engagement →</button>
//         </div>

//         <div
//           className="card dark"
//           onClick={() => setActiveSection("insight")}
//         >
//           <h3>AI Insight Summary</h3>
//           <p>{aiInsightText}</p>
//           <button>View Insights →</button>
//         </div>

//         <div
//           className="card red"
//           onClick={() => {
//             setActiveSection("features");
//             fetchShapExplanation();
//           }}
//         >
//           <h3>Key Risk Contributors</h3>
//           <p>Primary factors affecting risk score</p>
//           <button>View Factors →</button>
//         </div>
//       </div>

//       {/* ================= DETAIL SECTION ================= */}
//       {activeSection && (
//         <div className="details-section">

//           {/* 🔥 UPDATED REVIEW SECTION */}
//           {activeSection === "review" && (
//             <>
//               <h2>AI-Powered Academic Review</h2>

//               {reviewLoading && <p>Generating AI Review...</p>}

//               {reviewData && (
//                 <>
//                   <p><strong>Academic Health:</strong> {reviewData.health_status}</p>
//                   <p>{reviewData.summary}</p>

//                   <h3>Academic Pillars</h3>
//                   <ul>
//                     <li>Attendance: {reviewData.pillars.attendance.value}% ({reviewData.pillars.attendance.status})</li>
//                     <li>GPA: {reviewData.pillars.academics.value} ({reviewData.pillars.academics.status})</li>
//                     <li>Engagement: {reviewData.pillars.engagement.value} logins/week ({reviewData.pillars.engagement.status})</li>
//                     <li>Stress Level: {reviewData.pillars.wellbeing.value} ({reviewData.pillars.wellbeing.status})</li>
//                   </ul>

//                   {reviewData.top_concerns.length > 0 && (
//                     <>
//                       <h3>Top Concerns Identified</h3>
//                       <ul>
//                         {reviewData.top_concerns.map((c, i) => (
//                           <li key={i}>{c}</li>
//                         ))}
//                       </ul>
//                     </>
//                   )}

//                   <p><strong>AI Confidence:</strong> {reviewData.confidence}</p>
//                 </>
//               )}
//             </>
//           )}

//           {/* (All other sections remain unchanged) */}
//         </div>
//       )}
//     </div>
//   );
// }
