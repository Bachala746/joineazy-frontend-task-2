import { useState, useEffect } from "react";
import { getStoredAssignments, updateStudentSubmission } from "../../utils/storage";
import StatsOverview from "../../components/StatsOverview";
import AssignmentCard from "../../components/AssignmentCard";
import SubmitModal from "../../components/SubmitModal";
import Toast from "../../components/Toast";
import "./StudentDashboard.css";

/**
 * StudentDashboard displays the assignments and progress for the logged-in student.
 *
 * @param {object} currentUser - The currently authenticated student user
 */
function StudentDashboard({ currentUser }) {
  // 1. Core assignments state initialized from storage
  const [assignments, setAssignments] = useState(() => getStoredAssignments());

  // 2. Filter, search and sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'pending' | 'submitted' | 'overdue'
  const [sortBy, setSortBy] = useState("due-asc"); // 'due-asc' | 'due-desc'

  // 3. Modal and Toast notification states
  const [activeModalAssignment, setActiveModalAssignment] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });

  // Sync with storage on mount (in case changed elsewhere)
  useEffect(() => {
    setAssignments(getStoredAssignments());
  }, [currentUser]);

  // 4. Filter only assignments assigned to THIS student
  const studentAssignments = assignments.filter(
    (asg) => Array.isArray(asg.assignedTo) && asg.assignedTo.includes(currentUser.id)
  );

  // Helper: Get submission status for current student
  const getStudentStatus = (asg) => {
    const sub = (asg.submissions || []).find((s) => s.studentId === currentUser.id);
    return sub?.status === "Submitted" ? "Submitted" : "Pending";
  };

  // Helper: Check if assignment is overdue
  const isOverdue = (asg) => {
    const status = getStudentStatus(asg);
    if (status === "Submitted" || !asg.dueDate) return false;
    const dueDate = new Date(`${asg.dueDate}T23:59:59`);
    return dueDate < new Date();
  };

  // 5. Dynamic Progress Statistics
  const totalCount = studentAssignments.length;
  const submittedCount = studentAssignments.filter(
    (asg) => getStudentStatus(asg) === "Submitted"
  ).length;
  const pendingCount = totalCount - submittedCount;

  // 6. Filter & Sort pipeline for display
  const displayedAssignments = studentAssignments
    .filter((asg) => {
      // Status & Overdue filtering
      const status = getStudentStatus(asg);
      const overdue = isOverdue(asg);

      if (statusFilter === "pending") return status === "Pending";
      if (statusFilter === "submitted") return status === "Submitted";
      if (statusFilter === "overdue") return overdue;
      return true; // 'all'
    })
    .filter((asg) => {
      // Search query filtering
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        (asg.title || "").toLowerCase().includes(query) ||
        (asg.description || "").toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      // Due date sorting
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortBy === "due-asc" ? dateA - dateB : dateB - dateA;
    });

  // 7. Submission Handlers (Two-Step Confirmation)
  const handleOpenSubmitModal = (assignment) => {
    setActiveModalAssignment(assignment);
  };

  const handleCloseSubmitModal = () => {
    setActiveModalAssignment(null);
  };

  const handleConfirmSubmission = (assignmentId) => {
    try {
      // Update in localStorage
      const updated = updateStudentSubmission(assignmentId, currentUser.id, "Submitted");
      // Update local state immediately
      setAssignments(updated);
      setActiveModalAssignment(null);
      // Trigger success toast
      setToast({
        message: "Assignment marked as Submitted! Timestamp recorded.",
        type: "success",
      });
    } catch (error) {
      console.error("Submission failed:", error);
      setToast({
        message: "Failed to update submission status. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="student-dashboard">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-banner">
        <div>
          <span className="welcome-role-tag">Student Workspace</span>
          <h1 className="welcome-title">Welcome back, {currentUser.name}! 👋</h1>
          <p className="welcome-subtitle">
            Review your assigned coursework, access resources, and submit deliverables.
          </p>
        </div>
      </div>

      {/* Dynamic Statistics & Progress Overview */}
      <StatsOverview
        total={totalCount}
        submitted={submittedCount}
        pending={pendingCount}
      />

      {/* Controls Bar: Search, Filters & Sorting */}
      <div className="dashboard-controls-card">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assignments by title or description..."
            className="search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="search-clear-btn"
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Pills and Sort Selector */}
        <div className="filter-sort-row">
          {/* Status Filter Tabs */}
          <div className="filter-tabs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`filter-tab ${statusFilter === "all" ? "filter-tab-active" : ""}`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("pending")}
              className={`filter-tab ${statusFilter === "pending" ? "filter-tab-active" : ""}`}
            >
              Pending ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("submitted")}
              className={`filter-tab ${statusFilter === "submitted" ? "filter-tab-active" : ""}`}
            >
              Submitted ({submittedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("overdue")}
              className={`filter-tab ${statusFilter === "overdue" ? "filter-tab-active" : ""}`}
            >
              Overdue
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="sort-selector-wrapper">
            <span className="sort-label">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="due-asc">Due Date (Earliest First)</option>
              <option value="due-desc">Due Date (Latest First)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignment List / Empty States */}
      {displayedAssignments.length > 0 ? (
        <div className="assignments-grid">
          {displayedAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              studentId={currentUser.id}
              onSubmitClick={handleOpenSubmitModal}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="empty-state-card">
          <div className="empty-icon-circle">
            <svg
              className="empty-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="empty-title">
            {totalCount === 0
              ? "No assignments assigned to you yet"
              : "No assignments match your filter"}
          </h3>
          <p className="empty-desc">
            {totalCount === 0
              ? "Your professors have not published any assignments for your profile yet. Check back later!"
              : "Try adjusting your search query or switching your status filter back to 'All'."}
          </p>
          {(searchQuery || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="empty-reset-btn"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Two-Step Confirmation Modal */}
      <SubmitModal
        isOpen={Boolean(activeModalAssignment)}
        assignment={activeModalAssignment}
        onClose={handleCloseSubmitModal}
        onConfirm={handleConfirmSubmission}
      />

      {/* Feedback Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}

export default StudentDashboard;