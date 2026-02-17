import "../styles/EngagementLevel.css";

export default function EngagementLevel() {
  const student = JSON.parse(localStorage.getItem("student"));

  if (!student) {
    return <div className="engagement-page">Please login again.</div>;
  }

  // ✅ SAFE DEFAULTS (CRITICAL FIX)
  const lmsLogins = Number(student.lms_logins_per_week ?? 0);
  const libraryVisits = Number(student.library_visits_per_month ?? 0);
  const assignmentsDelayed = Number(student.assignments_delayed ?? 0);

  /* =========================
     ENGAGEMENT SCORE LOGIC
     ========================= */
  const calculateEngagementScore = () => {
    let score = 0;

    score += Math.min(lmsLogins * 10, 40);        // LMS usage
    score += Math.min(libraryVisits * 5, 30);    // Library usage
    score += assignmentsDelayed === 0 ? 30 : 10; // Assignments

    return Math.min(score, 100);
  };

  const engagementScore = calculateEngagementScore();

  const getStatus = (value) => {
    if (value >= 75) return { label: "Active Engagement", color: "green" };
    if (value >= 50) return { label: "Moderate Engagement", color: "yellow" };
    return { label: "Low Engagement", color: "red" };
  };

  const status = getStatus(engagementScore);

  return (
    <div className="engagement-page">
      <h1 className="page-title">Engagement Level</h1>

      <div className="engagement-grid">

        {/* LEFT CARD */}
        <div className="engagement-card">
          <h3>Engagement Score</h3>

          <div className={`score-value ${status.color}`}>
            {engagementScore}%
          </div>

          <span className={`status-badge ${status.color}`}>
            {status.label}
          </span>

          {/* SEGMENT BAR */}
          <div className="segmented-bar">
            <div className="segment green">≥ 75%</div>
            <div className="segment yellow">50–74%</div>
            <div className="segment red">&lt; 50%</div>

            <div
              className="marker"
              style={{ left: `${engagementScore}%` }}
            />
          </div>

          {/* AI EXPLANATION */}
          <div className="info-box">
            <h4>AI Explanation</h4>
            <p>
              {engagementScore >= 75 &&
                "The student demonstrates strong learning engagement through consistent LMS usage, timely submissions, and academic resource utilization."}

              {engagementScore >= 50 && engagementScore < 75 &&
                "Engagement is moderate. While the student participates academically, consistency and depth of interaction can be improved."}

              {engagementScore < 50 &&
                "Low engagement is detected. Reduced learning platform usage and academic interaction significantly increase dropout risk."}
            </p>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="engagement-breakdown">
          <h3>Engagement Breakdown</h3>

          <div className="metric">
            <span>LMS Logins / Week</span>
            <strong>{lmsLogins}</strong>
          </div>

          <div className="metric">
            <span>Library Visits / Month</span>
            <strong>{libraryVisits}</strong>
          </div>

          <div className="metric">
            <span>Assignments Delayed</span>
            <strong>{assignmentsDelayed}</strong>
          </div>

          <div className="info-box">
            <h4>Why Engagement Matters</h4>
            <p>
              Students with consistent academic engagement are statistically
              more likely to complete courses successfully and show lower
              dropout tendencies.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
