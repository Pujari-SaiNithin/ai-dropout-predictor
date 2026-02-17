export default function Topbar() {
  const student = JSON.parse(localStorage.getItem("student"));

  return (
    <div className="topbar">
      <div className="university">
        {student?.university_name || "University Dashboard"}
      </div>

      <div className="user-info">
        <span>{student?.full_name}</span>
      </div>
    </div>
  );
}
