
import React from "react";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";

import AuthPage from "./pages/AuthPage";
import { CoursesDashboard } from "./pages/CoursesDashboard";
import CourseAssignmentsPage from "./pages/CourseAssignmentsPage";

import Navbar from "./components/Navbar";
import { ToastContainer } from "./components/common/Toast";

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = React.useState("courses");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        {currentView === "courses" ? (
          <CoursesDashboard
            onSelectCourse={() => setCurrentView("assignments")}
          />
        ) : (
          <CourseAssignmentsPage
            onBack={() => setCurrentView("courses")}
          />
        )}
      </main>

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
