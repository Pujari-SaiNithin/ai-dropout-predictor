// src/pages/Reports.jsx
import "../styles/Reports.css";

export default function Reports() {
  const student = JSON.parse(localStorage.getItem("student"));
  const prediction = JSON.parse(localStorage.getItem("prediction"));

  if (!student || !prediction) {
    return <div className="reports-page">Please login again.</div>;
  }

  const today = new Date().toLocaleDateString();

  /* ---------------------------
     RISK META (SAME AS DASHBOARD)
  ---------------------------- */
  const getRiskMeta = (score) => {
    if (score <= 50) return { label: "Low Risk", color: "green" };
    if (score <= 75) return { label: "Medium Risk", color: "yellow" };
    return { label: "High Risk", color: "red" };
  };

  const risk = getRiskMeta(prediction.risk_score);

  /* ---------------------------
     ATTENDANCE STATUS
  ---------------------------- */
  const getAttendanceStatus = (value) => {
    if (value >= 75) return { label: "Healthy Attendance", color: "green" };
    if (value >= 65) return { label: "Irregular Attendance", color: "yellow" };
    return { label: "At Risk", color: "red" };
  };

  const attendanceStatus = getAttendanceStatus(student.attendance_pct);

  /* ---------------------------
     ENGAGEMENT SCORE
  ---------------------------- */
  const calculateEngagementScore = () => {
    let score = 0;
    score += Math.min(student.lms_logins_per_week * 10, 40);
    score += Math.min(student.library_visits_per_month * 5, 30);
    score += student.assignments_delayed === 0 ? 30 : 10;
    return Math.min(score, 100);
  };

  const engagementScore = calculateEngagementScore();

  const getEngagementStatus = (value) => {
    if (value >= 75) return "Active Engagement";
    if (value >= 50) return "Moderate Engagement";
    return "Low Engagement";
  };

  /* ---------------------------
     AI INTERPRETATION
  ---------------------------- */
  const generateInterpretation = () => {
    let reasons = [];

    if (student.attendance_pct < 75) reasons.push("attendance irregularities");
    if (student.gpa < 6.5) reasons.push("academic performance concerns");
    if (engagementScore < 50) reasons.push("low engagement levels");
    if (student.financial_stress_level >= 4) reasons.push("financial stress");
    if (student.stress_level >= 4) reasons.push("elevated stress levels");

    if (reasons.length === 0) {
      return "The student demonstrates stable academic behavior with no significant dropout indicators at this time.";
    }

    return `The student’s dropout risk is influenced by ${reasons.join(
      ", "
    )}. These factors collectively increase the likelihood of academic disengagement if not addressed.`;
  };

  return (
    <div className="reports-page">
      <h1 className="page-title">Student Academic Risk Report</h1>

      {/* HEADER */}
      <section className="report-section">
        <p><strong>Student Email:</strong> {student.email}</p>
        <p><strong>Report Generated On:</strong> {today}</p>
      </section>

      {/* OVERALL RISK */}
      <section className="report-section">
        <h2>Overall Dropout Risk Summary</h2>
        <p>
          <strong>Risk Score:</strong>{" "}
          <span className={`badge ${risk.color}`}>
            {prediction.risk_score}% – {risk.label}
          </span>
        </p>
        <p>
          This score represents the AI-estimated likelihood of the student
          discontinuing their academic program based on current data.
        </p>
      </section>

      {/* ATTENDANCE */}
      <section className="report-section">
        <h2>Attendance Overview</h2>
        <p>
          <strong>Attendance Percentage:</strong>{" "}
          {student.attendance_pct}%
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={`badge ${attendanceStatus.color}`}>
            {attendanceStatus.label}
          </span>
        </p>
        <p>
          Attendance below <b>75%</b> is strongly correlated with reduced academic
          engagement and increased dropout risk.
        </p>
      </section>

      {/* ENGAGEMENT */}
      <section className="report-section">
        <h2>Engagement Summary</h2>
        <p><strong>Engagement Score:</strong> {engagementScore}%</p>
        <p><strong>Status:</strong> {getEngagementStatus(engagementScore)}</p>

        <ul>
          <li>LMS Logins / Week: {student.lms_logins_per_week}</li>
          <li>Library Visits / Month: {student.library_visits_per_month}</li>
          <li>Assignments Delayed: {student.assignments_delayed}</li>
        </ul>
      </section>

      {/* ACADEMIC & STRESS */}
      <section className="report-section">
        <h2>Academic & Wellbeing Indicators</h2>
        <ul>
          <li>GPA: {student.gpa}</li>
          <li>Backlogs: {student.backlogs}</li>
          <li>Stress Level: {student.stress_level}</li>
          <li>Financial Stress Level: {student.financial_stress_level}</li>
        </ul>
      </section>

      {/* AI INTERPRETATION */}
      <section className="report-section">
        <h2>AI Interpretation</h2>
        <p>{generateInterpretation()}</p>
      </section>

      {/* FOOTER */}
      <footer className="report-footer">
        <p>
          This report is system-generated using AI-based analysis and is intended
          for academic monitoring purposes only.
        </p>
      </footer>
    </div>
  );
}
