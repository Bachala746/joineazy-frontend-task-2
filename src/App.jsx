
import { useState } from "react";
import { MOCK_USERS } from "./data/mockUsers";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import "./App.css";

function App() {
  // Restore logged-in user from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("joineazy_user");
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Failed to load user session:", error);
      return null;
    }
  });

  // Login screen states
  const [selectedRole, setSelectedRole] = useState("student");
  const [selectedUserId, setSelectedUserId] = useState("student-1");

  const availableUsers = MOCK_USERS.filter(
    (user) => user.role === selectedRole
  );

  // Switch login role
  const handleRoleTabChange = (role) => {
    setSelectedRole(role);
    const firstUser = MOCK_USERS.find((user) => user.role === role);

    if (firstUser) {
      setSelectedUserId(firstUser.id);
    }
  };

  // Login
  const handleLogin = (e) => {
    e.preventDefault();

    const userToLogin = MOCK_USERS.find(
      (user) => user.id === selectedUserId
    );

    if (userToLogin) {
      setCurrentUser(userToLogin);
      localStorage.setItem(
        "joineazy_user",
        JSON.stringify(userToLogin)
      );
    }
  };

  // Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("joineazy_user");
    setSelectedRole("student");
    setSelectedUserId("student-1");
  };

  // ==========================================
  // VIEW 1: LOGIN SCREEN
  // ==========================================
  if (!currentUser) {
    return (
      <div className="login-container">
        <div className="hero-section">
          <div className="hero-glow-top" />
          <div className="hero-glow-bottom" />

          <div className="hero-content">
            <div className="hero-brand">
              <div className="hero-brand-icon">J</div>
              <div>
                <span className="hero-brand-title">Joineazy</span>
                <span className="hero-brand-subtitle">
                  Assessment Dashboard
                </span>
              </div>
            </div>

            <div className="mt-12 lg:mt-16">
              <span className="hero-badge">
                <span className="hero-badge-pulse" />
                Internship Demo Environment
              </span>

              <h1 className="hero-title">
                Streamline assignments & review workflows.
              </h1>

              <p className="hero-description">
                A role-based dashboard for professors to distribute
                assignments and students to submit coursework with
                two-step confirmations.
              </p>
            </div>
          </div>

          <div className="hero-preview-card">
            <div className="preview-header">
              <div className="preview-status">
                <span className="preview-status-dot" />
                <span>Active Assignment</span>
              </div>
              <span className="preview-tag">Due in 3 days</span>
            </div>

            <div>
              <p className="preview-title">
                Responsive Portfolio & Component Review
              </p>
              <p className="preview-desc">
                React hooks, Tailwind responsive design, and submission
                states.
              </p>
            </div>

            <div>
              <div className="preview-progress-label">
                <span>Class Submissions</span>
                <span className="text-indigo-300">4 of 5 (80%)</span>
              </div>

              <div className="preview-progress-track">
                <div className="preview-progress-bar" />
              </div>
            </div>
          </div>

          <div className="hero-footer">
            <div className="hero-highlights">
              <div className="highlight-item">
                <svg
                  className="highlight-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Dual Role Permissions</span>
              </div>

              <div className="highlight-item">
                <svg
                  className="highlight-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>localStorage Persistence</span>
              </div>
            </div>
          </div>
        </div>

        {/* Login section */}
        <div className="auth-section">
          <div className="auth-wrapper">
            <div className="mobile-header">
              <div className="mobile-logo">J</div>
              <h2 className="text-2xl font-bold text-slate-800">
                Joineazy Portal
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select a demo user to explore the dashboard
              </p>
            </div>

            <div className="auth-card">
              <div className="mb-6">
                <h2 className="auth-title">Welcome to Joineazy</h2>
                <p className="auth-subtitle">
                  Choose a role and select a pre-seeded persona to sign in.
                </p>
              </div>

              {/* Role selection */}
              <div className="role-tabs">
                <button
                  type="button"
                  onClick={() => handleRoleTabChange("student")}
                  className={`role-tab ${
                    selectedRole === "student" ? "role-tab-active" : ""
                  }`}
                >
                  <span>🎓</span>
                  <span>Student (5)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleTabChange("admin")}
                  className={`role-tab ${
                    selectedRole === "admin" ? "role-tab-active" : ""
                  }`}
                >
                  <span>👨‍🏫</span>
                  <span>Professor / Admin (2)</span>
                </button>
              </div>

              {/* Demo user selection */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="persona-list-header">
                  <span>
                    Available{" "}
                    {selectedRole === "admin" ? "Professors" : "Students"}
                  </span>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {availableUsers.length} profiles ready
                  </span>
                </div>

                <div className="persona-list">
                  {availableUsers.map((user) => {
                    const isSelected = selectedUserId === user.id;
                    const isProf = user.role === "admin";

                    return (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUserId(user.id)}
                        className={`persona-card ${
                          isSelected ? "persona-card-active" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`persona-avatar ${
                              isProf ? "avatar-admin" : "avatar-student"
                            }`}
                          >
                            {user.name.charAt(0)}
                          </div>

                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <p className="persona-name">{user.name}</p>

                              {isSelected && (
                                <span className="persona-selected-badge">
                                  Selected
                                </span>
                              )}
                            </div>

                            <p className="persona-email">{user.email}</p>
                          </div>
                        </div>

                        <div
                          className={`radio-indicator ${
                            isSelected ? "radio-indicator-active" : ""
                          }`}
                        >
                          {isSelected && <div className="radio-dot" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button type="submit" className="auth-submit-btn">
                  <span>
                    Continue as{" "}
                    {selectedRole === "admin" ? "Professor" : "Student"}
                  </span>

                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </form>

              <div className="auth-hint-box">
                <div className="hint-icon">⚡</div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Mock authentication enabled. No password needed. State
                  and role permissions will persist in your browser session.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: LOGGED-IN APPLICATION
  // ==========================================
  return (
    <div className="app-shell">
      {/* Top navigation */}
      <header className="top-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="navbar-brand-icon">J</div>

            <div>
              <span className="navbar-brand-title">Joineazy</span>
              <span className="navbar-portal-tag">
                {currentUser.role === "admin"
                  ? "Professor Portal"
                  : "Student Portal"}
              </span>
            </div>
          </div>

          {/* User profile and logout */}
          <div className="navbar-user-actions">
            <div className="flex items-center gap-2.5 text-right">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ${
                  currentUser.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {currentUser.name.charAt(0)}
              </div>

              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <button onClick={handleLogout} className="btn-signout">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="main-content">
        {currentUser.role === "admin" ? (
          <AdminDashboard currentUser={currentUser} />
        ) : (
          <StudentDashboard currentUser={currentUser} />
        )}
      </main>
    </div>
  );
}

export default App;
