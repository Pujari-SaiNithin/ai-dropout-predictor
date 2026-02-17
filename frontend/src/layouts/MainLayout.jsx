import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/sidebar.css";

export default function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}
