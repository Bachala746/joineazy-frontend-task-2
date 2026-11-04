import "./AssignmentCard.css";

/**
 * AssignmentCard displays details of a single assignment for a student.
 *
 * @param {object} assignment - The assignment data object
 * @param {string} studentId - The ID of the logged-in student
 * @param {function} onSubmitClick - Callback when student initiates submission
 */
function AssignmentCard({ assignment, studentId, onSubmitClick }) {
  // 1. Find the logged-in student's submission record
  const studentSubmission = (assignment.submissions || []).find(
    (sub) => sub.studentId === studentId
  );

  const isSubmitted = studentSubmission?.status === "Submitted";
  const submittedAt = studentSubmission?.submittedAt;

  // 2. Check if assignment is overdue (due date has passed and not submitted)
  const isOverdue = (() => {
    if (isSubmitted || !assignment.dueDate) return false;
    // Set due time to the end of the due date (23:59:59)
    const dueDate = new Date(`${assignment.dueDate}T23:59:59`);
    return dueDate < new Date();
  })();

  // 3. Format dates for clean display
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className={`assignment-card ${
        isOverdue ? "assignment-card-overdue" : ""
      } ${isSubmitted ? "assignment-card-submitted" : ""}`}
    >
      {/* Top Meta Bar */}
      <div className="card-top-bar">
        {/* Status Badge */}
        <div className="status-badge-wrapper">
          {isSubmitted ? (
            <span className="badge badge-submitted">
              <svg
                className="badge-icon"
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
              Submitted
            </span>
          ) : isOverdue ? (
            <span className="badge badge-overdue">
              <svg
                className="badge-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Overdue
            </span>
          ) : (
            <span className="badge badge-pending">
              <svg
                className="badge-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Pending
            </span>
          )}
        </div>

        {/* Due Date Indicator */}
        <div
          className={`due-date-pill ${
            isOverdue ? "due-date-overdue" : "due-date-normal"
          }`}
        >
          <span className="due-date-label">Due:</span>
          <span className="due-date-value">
            {formatDate(assignment.dueDate)}
          </span>
        </div>
      </div>

      {/* Title & Description */}
      <div className="card-body">
        <h3 className="assignment-title">{assignment.title}</h3>
        <p className="assignment-desc">{assignment.description}</p>
      </div>

      {/* Google Drive Link */}
      {assignment.driveLink && (
        <div className="card-drive-section">
          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="drive-link-btn"
          >
            <div className="drive-icon-wrapper">
              <svg
                className="drive-icon"
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
            </div>
            <div className="drive-text">
              <span className="drive-label">Google Drive Folder</span>
              <span className="drive-subtext">Access assignment materials</span>
            </div>
            <svg
              className="external-icon"
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

      {/* Card Footer: Action or Submitted Status */}
      <div className="card-footer">
        {isSubmitted ? (
          <div className="submitted-banner">
            <svg
              className="submitted-icon"
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
            <span>
              Turned in on {formatDate(submittedAt)}
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onSubmitClick(assignment)}
            className={`btn-submit-action ${
              isOverdue ? "btn-submit-overdue" : "btn-submit-primary"
            }`}
          >
            <span>Yes, I have submitted</span>
            <svg
              className="btn-arrow-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default AssignmentCard;