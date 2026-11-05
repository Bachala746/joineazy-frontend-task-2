import { useState, useEffect } from "react";
import { MOCK_USERS } from "../../data/mockUsers";
import {
  getStoredAssignments,
  createStoredAssignment,
  updateStoredAssignment,
  deleteStoredAssignment,
} from "../../utils/storage";
import Toast from "../../components/Toast";
import "./AdminDashboard.css";

/**
 * AdminDashboard allows professors to manage assignments, view individual
 * student submission statuses, and monitor class completion rates.
 *
 * @param {object} currentUser - Logged in admin user object
 */
function AdminDashboard({ currentUser }) {
  // 1. Core data state
  const [assignments, setAssignments] = useState(() => getStoredAssignments());
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Modal state (handles both Create and Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // 3. Delete confirmation state
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  // 4. Expanded roster state per assignment card
  const [expandedCardId, setExpandedCardId] = useState(null);

  // 5. Toast feedback
  const [toast, setToast] = useState({ message: "", type: "success" });

  // List of all student profiles (5 students)
  const allStudents = MOCK_USERS.filter((user) => user.role === "student");

  // 6. Form state for Create / Edit modal
  const initialFormState = {
    title: "",
    description: "",
    dueDate: "",
    driveLink: "",
    assignedTo: allStudents.map((s) => s.id),
    assignOption: "all", // "all" | "custom"
  };
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // Sync state on user change or mount
  useEffect(() => {
    setAssignments(getStoredAssignments());
  }, [currentUser]);

  // 7. Filter: ONLY assignments created by THIS professor
  const adminAssignments = assignments.filter(
    (asg) => asg.createdBy === currentUser.id
  );

  // Search filtering
  const displayedAssignments = adminAssignments.filter((asg) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (asg.title || "").toLowerCase().includes(query) ||
      (asg.description || "").toLowerCase().includes(query)
    );
  });

  // Overall Statistics for Professor
  const totalCreated = adminAssignments.length;
  const totalSubmissionsExpected = adminAssignments.reduce(
    (acc, asg) => acc + (asg.assignedTo?.length || 0),
    0
  );
  const totalSubmissionsReceived = adminAssignments.reduce((acc, asg) => {
    const assignedList = Array.isArray(asg.assignedTo) ? asg.assignedTo : [];
    const submissionsList = Array.isArray(asg.submissions) ? asg.submissions : [];
    const submittedCount = submissionsList.filter(
      (sub) =>
        sub.status === "Submitted" && assignedList.includes(sub.studentId)
    ).length;
    return acc + submittedCount;
  }, 0);

  const overallClassPercentage =
    totalSubmissionsExpected > 0
      ? Math.round((totalSubmissionsReceived / totalSubmissionsExpected) * 100)
      : 0;

  // ==========================================
  // MODAL HANDLERS
  // ==========================================
  const handleOpenCreateModal = () => {
    setEditingAssignment(null);
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      driveLink: "",
      assignedTo: allStudents.map((s) => s.id),
      assignOption: "all",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (assignment) => {
    setEditingAssignment(assignment);

    const currentAssigned = Array.isArray(assignment.assignedTo)
      ? [...new Set(assignment.assignedTo)]
      : [];

    const isAll =
      allStudents.length > 0 &&
      currentAssigned.length === allStudents.length &&
      allStudents.every((s) => currentAssigned.includes(s.id));

    setFormData({
      title: assignment.title || "",
      description: assignment.description || "",
      dueDate: assignment.dueDate || "",
      driveLink: assignment.driveLink || "",
      assignedTo: currentAssigned,
      assignOption: isAll ? "all" : "custom",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
    setFormData(initialFormState);
    setFormErrors({});
  };

  // Assign option toggle ("all" vs "custom")
  const handleAssignOptionChange = (option) => {
    if (option === "all") {
      setFormData((prev) => ({
        ...prev,
        assignOption: "all",
        assignedTo: allStudents.map((s) => s.id),
      }));
    } else {
      setFormData((prev) => {
        let customList = prev.assignedTo;

        // When switching from "all" to "custom"
        if (prev.assignOption === "all") {
          if (editingAssignment && Array.isArray(editingAssignment.assignedTo)) {
            // While editing: restore assignment's exact original assigned IDs
            customList = [...new Set(editingAssignment.assignedTo)];
          } else {
            // While creating: keep selection or default to all students
            customList =
              prev.assignedTo && prev.assignedTo.length > 0
                ? prev.assignedTo
                : allStudents.map((s) => s.id);
          }
        }

        return {
          ...prev,
          assignOption: "custom",
          assignedTo: customList,
        };
      });
    }
  };

  // Toggle individual student checkbox
  const handleToggleStudent = (studentId) => {
    setFormData((prev) => {
      const alreadySelected = prev.assignedTo.includes(studentId);
      const updated = alreadySelected
        ? prev.assignedTo.filter((id) => id !== studentId)
        : [...prev.assignedTo, studentId];

      return {
        ...prev,
        assignedTo: updated,
        assignOption: "custom", // Remain in custom mode; do not auto-collapse UI
      };
    });
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Assignment title is required.";
    }
    if (!formData.description.trim()) {
      errors.description = "Assignment description is required.";
    }
    if (!formData.dueDate) {
      errors.dueDate = "Due date is required.";
    }
    if (!formData.driveLink.trim()) {
      errors.driveLink = "Google Drive link is required.";
    } else if (
      !formData.driveLink.startsWith("http://") &&
      !formData.driveLink.startsWith("https://")
    ) {
      errors.driveLink = "Please provide a valid URL starting with https://";
    }

    const effectiveAssigned =
      formData.assignOption === "all"
        ? allStudents.map((s) => s.id)
        : formData.assignedTo;

    if (!effectiveAssigned || effectiveAssigned.length === 0) {
      errors.assignedTo = "Please select at least one student.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save Assignment (Create or Edit)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Resolve assigned IDs strictly based on selected assignOption
    const finalAssignedTo =
      formData.assignOption === "all"
        ? allStudents.map((s) => s.id)
        : [...new Set(formData.assignedTo)];

    if (editingAssignment) {
      // Edit mode: pass fallbackSubmissions from the assignment held in state
      const updatedList = updateStoredAssignment(editingAssignment.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate,
        driveLink: formData.driveLink.trim(),
        assignedTo: finalAssignedTo,
        fallbackSubmissions: editingAssignment.submissions,
      });

      setAssignments(updatedList);
      setToast({
        message: "Assignment updated successfully!",
        type: "success",
      });
    } else {
      // Create mode
      const updatedList = createStoredAssignment({
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate,
        driveLink: formData.driveLink.trim(),
        assignedTo: finalAssignedTo,
        createdBy: currentUser.id,
      });

      setAssignments(updatedList);
      setToast({
        message: "New assignment published successfully!",
        type: "success",
      });
    }

    handleCloseModal();
  };

  // ==========================================
  // DELETE HANDLERS
  // ==========================================
  const handleConfirmDelete = () => {
    if (!assignmentToDelete) return;

    const updatedList = deleteStoredAssignment(assignmentToDelete.id);
    setAssignments(updatedList);
    setAssignmentToDelete(null);
    setToast({
      message: "Assignment was deleted.",
      type: "success",
    });
  };

  // Toggle expanded student list drawer
  const handleToggleExpand = (assignmentId) => {
    setExpandedCardId((prev) => (prev === assignmentId ? null : assignmentId));
  };

  return (
    <div className="admin-dashboard">
      {/* Welcome Banner */}
      <div className="admin-banner">
        <div className="admin-banner-text">
          <span className="admin-badge">Professor Workspace</span>
          <h1 className="admin-title">Welcome, {currentUser.name}! 👨‍🏫</h1>
          <p className="admin-subtitle">
            Create coursework, track student submissions in real time, and monitor
            class-wide completion rates.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="btn-create-assignment"
        >
          <svg
            className="btn-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Create Assignment</span>
        </button>
      </div>

      {/* Professor Overview Stats */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card stat-purple">
          <div className="admin-stat-icon-wrapper icon-purple">
            <svg
              className="stat-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{totalCreated}</span>
            <span className="admin-stat-label">Assignments Created</span>
          </div>
        </div>

        <div className="admin-stat-card stat-emerald">
          <div className="admin-stat-icon-wrapper icon-emerald">
            <svg
              className="stat-icon"
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
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{totalSubmissionsReceived}</span>
            <span className="admin-stat-label">Total Submissions Received</span>
          </div>
        </div>

        <div className="admin-stat-card stat-indigo">
          <div className="admin-stat-icon-wrapper icon-indigo">
            <svg
              className="stat-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{overallClassPercentage}%</span>
            <span className="admin-stat-label">Average Class Completion</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="admin-search-bar">
        <svg
          className="admin-search-icon"
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
          placeholder="Search your assignments by title or description..."
          className="admin-search-input"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="admin-search-clear"
          >
            ×
          </button>
        )}
      </div>

      {/* Assignment List */}
      {displayedAssignments.length > 0 ? (
        <div className="admin-assignment-list">
          {displayedAssignments.map((assignment) => {
            const assignedList = Array.isArray(assignment.assignedTo)
              ? assignment.assignedTo
              : [];
            const submissionsList = Array.isArray(assignment.submissions)
              ? assignment.submissions
              : [];

            const assignedCount = assignedList.length;
            const submittedCount = submissionsList.filter(
              (sub) =>
                sub.status === "Submitted" && assignedList.includes(sub.studentId)
            ).length;

            const completionPercent =
              assignedCount > 0
                ? Math.round((submittedCount / assignedCount) * 100)
                : 0;

            const isExpanded = expandedCardId === assignment.id;

            return (
              <div key={assignment.id} className="admin-assignment-card">
                {/* Header Row */}
                <div className="admin-card-header">
                  <div>
                    <div className="admin-card-meta">
                      <span className="admin-card-due">
                        📅 Due: {assignment.dueDate}
                      </span>
                      <span className="admin-card-assigned-count">
                        👥 {assignedCount} {assignedCount === 1 ? "student" : "students"} assigned
                      </span>
                    </div>
                    <h3 className="admin-card-title">{assignment.title}</h3>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="admin-card-actions">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(assignment)}
                      className="btn-action-edit"
                      title="Edit Assignment"
                    >
                      <svg
                        className="action-icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssignmentToDelete(assignment)}
                      className="btn-action-delete"
                      title="Delete Assignment"
                    >
                      <svg
                        className="action-icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="admin-card-desc">{assignment.description}</p>

                {/* Drive Link Row */}
                {assignment.driveLink && (
                  <div className="admin-drive-row">
                    <a
                      href={assignment.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-drive-link"
                    >
                      <svg
                        className="admin-drive-icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      </svg>
                      <span>Open Google Drive Materials</span>
                      <svg
                        className="admin-external-icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                )}

                {/* Completion Progress Section */}
                <div className="admin-progress-section">
                  <div className="admin-progress-header">
                    <span className="admin-progress-label">Class Progress</span>
                    <span className="admin-progress-fraction">
                      <strong>{submittedCount}</strong> of {assignedCount} submitted ({completionPercent}%)
                    </span>
                  </div>
                  <div className="admin-progress-track">
                    <div
                      className="admin-progress-bar"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>

                {/* Expand / Collapse Student Roster */}
                <div className="admin-roster-toggle-row">
                  <button
                    type="button"
                    onClick={() => handleToggleExpand(assignment.id)}
                    className="btn-toggle-roster"
                  >
                    <span>
                      {isExpanded
                        ? "Hide Student Submission List"
                        : `View Student Submissions (${assignedCount})`}
                    </span>
                    <svg
                      className={`toggle-arrow ${isExpanded ? "toggle-arrow-open" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Expanded Student Submission Roster */}
                {isExpanded && (
                  <div className="admin-student-roster">
                    <h4 className="roster-heading">Assigned Student Statuses</h4>
                    <div className="roster-grid">
                      {assignedList.map((studentId) => {
                        const student = MOCK_USERS.find((u) => u.id === studentId);
                        const subRecord = submissionsList.find(
                          (s) => s.studentId === studentId
                        );
                        const isSubmitted = subRecord?.status === "Submitted";

                        return (
                          <div
                            key={studentId}
                            className={`roster-student-item ${
                              isSubmitted ? "roster-item-submitted" : "roster-item-pending"
                            }`}
                          >
                            <div className="roster-student-info">
                              <div className="roster-avatar">
                                {student ? student.name.charAt(0) : "S"}
                              </div>
                              <div>
                                <p className="roster-student-name">
                                  {student ? student.name : "Unknown Student"}
                                </p>
                                <p className="roster-student-email">
                                  {student ? student.email : ""}
                                </p>
                              </div>
                            </div>

                            {/* Status Tag */}
                            <div>
                              {isSubmitted ? (
                                <span className="roster-status-submitted">
                                  ✓ Submitted
                                </span>
                              ) : (
                                <span className="roster-status-pending">
                                  ⏳ Not Submitted
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="admin-empty-state">
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
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="empty-title">
            {totalCreated === 0
              ? "No assignments created yet"
              : "No matching assignments found"}
          </h3>
          <p className="empty-desc">
            {totalCreated === 0
              ? "You haven't published any assignments. Click the 'Create Assignment' button above to get started."
              : "Try adjusting your search query to find the assignment you are looking for."}
          </p>
          {totalCreated === 0 ? (
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="btn-create-assignment"
            >
              + Create First Assignment
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="empty-reset-btn"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* ========================================================
          CREATE / EDIT MODAL
          ======================================================== */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="admin-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingAssignment ? "Edit Assignment" : "Create New Assignment"}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="admin-modal-close"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="admin-modal-form">
              {/* Title */}
              <div className="form-group">
                <label className="form-label">
                  Assignment Title <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Dynamic Component Architecture"
                  className={`form-input ${formErrors.title ? "form-input-error" : ""}`}
                />
                {formErrors.title && (
                  <span className="error-text">{formErrors.title}</span>
                )}
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">
                  Description <span className="required-star">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Outline key requirements, submission criteria, and deliverables..."
                  className={`form-textarea ${
                    formErrors.description ? "form-input-error" : ""
                  }`}
                />
                {formErrors.description && (
                  <span className="error-text">{formErrors.description}</span>
                )}
              </div>

              {/* Due Date & Drive Link Grid */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    Due Date <span className="required-star">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className={`form-input ${
                      formErrors.dueDate ? "form-input-error" : ""
                    }`}
                  />
                  {formErrors.dueDate && (
                    <span className="error-text">{formErrors.dueDate}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Google Drive Link <span className="required-star">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.driveLink}
                    onChange={(e) =>
                      setFormData({ ...formData, driveLink: e.target.value })
                    }
                    placeholder="https://drive.google.com/..."
                    className={`form-input ${
                      formErrors.driveLink ? "form-input-error" : ""
                    }`}
                  />
                  {formErrors.driveLink && (
                    <span className="error-text">{formErrors.driveLink}</span>
                  )}
                </div>
              </div>

              {/* Student Assignment Selection */}
              <div className="form-group">
                <label className="form-label">
                  Assign To <span className="required-star">*</span>
                </label>

                <div className="assign-options-row">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="assignOption"
                      checked={formData.assignOption === "all"}
                      onChange={() => handleAssignOptionChange("all")}
                      className="form-radio"
                    />
                    <span>All Students (5)</span>
                  </label>

                  <label className="radio-label">
                    <input
                      type="radio"
                      name="assignOption"
                      checked={formData.assignOption === "custom"}
                      onChange={() => handleAssignOptionChange("custom")}
                      className="form-radio"
                    />
                    <span>Select Specific Students</span>
                  </label>
                </div>

                {/* Individual Student Checkboxes */}
                {formData.assignOption === "custom" && (
                  <div className="student-checkbox-list">
                    {allStudents.map((student) => {
                      const isChecked = formData.assignedTo.includes(student.id);
                      return (
                        <label
                          key={student.id}
                          className={`student-checkbox-item ${
                            isChecked ? "student-checkbox-selected" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleStudent(student.id)}
                            className="form-checkbox"
                          />
                          <div className="checkbox-student-info">
                            <span className="checkbox-student-name">
                              {student.name}
                            </span>
                            <span className="checkbox-student-email">
                              {student.email}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}

                {formErrors.assignedTo && (
                  <span className="error-text">{formErrors.assignedTo}</span>
                )}
              </div>

              {/* Modal Actions */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingAssignment ? "Save Changes" : "Publish Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION DIALOG
          ======================================================== */}
      {assignmentToDelete && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setAssignmentToDelete(null)}
        >
          <div
            className="delete-dialog-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-icon-circle">
              <svg
                className="delete-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="delete-title">Delete Assignment?</h3>
            <p className="delete-desc">
              Are you sure you want to delete{" "}
              <strong>"{assignmentToDelete.title}"</strong>? All associated
              student submission records for this assignment will be removed.
              This cannot be undone.
            </p>
            <div className="delete-dialog-actions">
              <button
                type="button"
                onClick={() => setAssignmentToDelete(null)}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn-delete-confirm"
              >
                Yes, Delete Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}

export default AdminDashboard;