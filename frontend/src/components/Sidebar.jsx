import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2 className="logo">AI Dropout</h2>

      <ul className="menu">
        <li onClick={() => navigate("/profile")}>Profile</li>
        <li onClick={() => navigate("/dashboard")}>Dashboard</li>

        {/* ✅ CONNECTED */}
        <li onClick={() => navigate("/risk")}>Risk Prediction</li>

        <li onClick={() => navigate("/attendance")}>Attendance Health</li>
        <li onClick={() => navigate("/engagement")}>Engagement Level</li>
        <li onClick={() => navigate("/reports")}>Reports</li>

        <li onClick={logout} className="logout">Logout</li>
      </ul>
    </div>
  );
}
