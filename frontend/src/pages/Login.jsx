import "../styles/Login.css";
import brain from "../assets/brain.png";
import { useState } from "react";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      // ✅ STORE FULL STUDENT DATA (FROM DATASET)
      localStorage.setItem(
        "student",
        JSON.stringify(res.data.student)
      );

      // ✅ STORE PREDICTION DATA
      localStorage.setItem(
        "prediction",
        JSON.stringify(res.data.prediction)
      );

      // ✅ REDIRECT TO PROFILE PAGE
      window.location.href = "/profile";

    } catch (err) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <img src={brain} alt="AI Brain" />
        <h1>Student Dropout</h1>
        <h2>Prediction System</h2>
      </div>

      <div className="right-panel">
        <form className="login-box" onSubmit={handleLogin}>
          <h2>Login</h2>

          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="options">
            <label className="remember">
              <input type="checkbox" /> Remember me
            </label>
            <span className="forgot">Forgot password?</span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
