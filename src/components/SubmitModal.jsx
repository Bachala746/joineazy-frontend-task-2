import { useEffect, useState } from "react";
import "./SubmitModal.css";

/**
 * Two-Step Assignment Submission Confirmation Dialog.
 *
 * @param {boolean} isOpen - Whether modal is visible
 * @param {object} assignment - The target assignment object
 * @param {function} onClose - Closes the modal without submitting
 * @param {function} onConfirm - Confirms submission and updates status
 */
function SubmitModal({ isOpen, assignment, onClose, onConfirm }) {
  const [isConfirmedCheckbox, setIsConfirmedCheckbox] = useState(false);

  // Reset confirmation checkbox whenever modal opens or assignment changes
  useEffect(() => {
    if (isOpen) {
      setIsConfirmedCheckbox(false);
    }
  }, [isOpen, assignment]);

  // Accessibility: Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !assignment) return null;

  const handleFinalSubmit = () => {
    onConfirm(assignment.id);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal Card - Prevent closing when clicking inside */}
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <div className="modal-icon-badge">
              <svg
                className="modal-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 id="modal-title" className="modal-title">
                Confirm Submission
              </h3>
              <p className="modal-subtitle">Step 2 of 2: Final Verification</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close dialog"
          >
            <svg
              className="modal-close-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body Content */}
        <div className="modal-body">
          <p className="modal-instruction">
            You are about to mark this assignment as <strong>Submitted</strong>.
            Please ensure you have uploaded all your final files to the Google
            Drive folder.
          </p>

          {/* Assignment Preview Box */}
          <div className="modal-assignment-box">
            <p className="modal-assignment-label">Assignment</p>
            <h4 className="modal-assignment-title">{assignment.title}</h4>
            <div className="modal-meta-row">
              <span className="modal-meta-due">
                📅 Due: {assignment.dueDate}
              </span>
              {assignment.driveLink && (
                <a
                  href={assignment.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-drive-btn"
                >
                  <span>Verify Drive Folder</span>
                  <svg
                    className="modal-external-icon"
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
              )}
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <label className="modal-confirm-checkbox-label">
            <input
              type="checkbox"
              checked={isConfirmedCheckbox}
              onChange={(e) => setIsConfirmedCheckbox(e.target.checked)}
              className="modal-confirm-checkbox"
            />
            <span className="modal-confirm-checkbox-text">
              I have uploaded my deliverables to the designated Drive link and
              verified the access permissions.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="modal-cancel-btn"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={!isConfirmedCheckbox}
            className="modal-submit-btn"
          >
            Yes, Confirm Submission
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmitModal;