import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import RiskPrediction from "./pages/RiskPrediction";
import Attendance from "./pages/AttendanceHealth";
import EngagementLevel from "./pages/EngagementLevel";
import Reports from "./pages/Reports";

import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ---------------- LOGIN (NO LAYOUT) ---------------- */}
        <Route path="/" element={<Login />} />

        {/* ---------------- WITH MAIN LAYOUT ---------------- */}
        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        <Route
          path="/risk"
          element={
            <MainLayout>
              <RiskPrediction />
            </MainLayout>
          }
        />

        <Route
          path="/attendance"
          element={
            <MainLayout>
              <Attendance />
            </MainLayout>
          }
        />

        <Route
          path="/engagement"
          element={
            <MainLayout>
              <EngagementLevel />
            </MainLayout>
          }
        />

        {/* ✅ REPORTS PAGE (FIXED & CONNECTED) */}
        <Route
          path="/reports"
          element={
            <MainLayout>
              <Reports />
            </MainLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
