import "../styles/Profile.css";
import avatar from "../assets/avatar.png";

export default function Profile() {
  const student = JSON.parse(localStorage.getItem("student"));
  const prediction = JSON.parse(localStorage.getItem("prediction"));

  // Safety check (prevents blank screen)
  if (!student || !prediction) {
    return (
      <div className="profile-page">
        <h2>Session expired. Please login again.</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* HEADER */}
      <div className="profile-header">
        <img src={avatar} className="avatar" alt="Profile" />

        <div className="profile-basic">
          <h1>{student.full_name}</h1>
          <p className="email">{student.email}</p>
          <span className="status">Active</span>
        </div>
      </div>

      {/* CONDITIONAL RISK ALERT */}
      {prediction.confidence > 75 && (
        <div className="risk-alert">
          <strong>⚠ High Dropout Risk Detected</strong>
          <p>Confidence: {prediction.confidence}%</p>
        </div>
      )}

      {/* STUDENT INFORMATION */}
      <div className="section">
        <h2>Student Information</h2>

        <div className="info-grid">
          <div><b>Register Number:</b> {student.register_number}</div>
          <div><b>Program:</b> {student.program}</div>
          <div><b>Department:</b> {student.department}</div>
          <div><b>Year:</b> {student.year}</div>
          <div><b>Section:</b> {student.section}</div>
          <div><b>GPA:</b> {student.gpa}</div>
          <div><b>Backlogs:</b> {student.backlogs}</div>
        </div>
      </div>

      {/* INSTITUTION DETAILS */}
      <div className="section">
        <h2>Institutional Details</h2>

        <div className="info-grid">
          <div><b>Faculty Advisor:</b> {student.faculty_advisor}</div>
          <div><b>HOD:</b> {student.hod_name}</div>
          <div><b>College:</b> {student.college_name}</div>
          <div><b>University:</b> {student.university_name}</div>
        </div>
      </div>

      {/* ACTION */}
      <div className="action-area">
        <button onClick={() => window.location.href = "/dashboard"}>
          Go to Dashboard →
        </button>
      </div>
    </div>
  );
}
