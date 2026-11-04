import { useEffect } from "react";
import "./Toast.css";

/**
 * Reusable Toast component for feedback notifications.
 *
 * @param {string} message - Text to display
 * @param {'success' | 'error'} type - Style theme (success or error)
 * @param {function} onClose - Handler called when toast is dismissed
 * @param {number} duration - Auto-dismiss timeout in ms (default: 3500ms)
 */
function Toast({ message, type = "success", onClose, duration = 3500 }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`toast-container ${isSuccess ? "toast-success" : "toast-error"}`}
    >
      {/* Status Icon */}
      <div
        className={`toast-icon-wrapper ${
          isSuccess ? "toast-icon-success" : "toast-icon-error"
        }`}
      >
        {isSuccess ? (
          <svg
            className="toast-icon"
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
        ) : (
          <svg
            className="toast-icon"
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
        )}
      </div>

      {/* Message Text */}
      <div className="toast-text-content">
        <p className="toast-title">
          {isSuccess ? "Success" : "Notification"}
        </p>
        <p className="toast-message">{message}</p>
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="toast-close-btn"
        aria-label="Close notification"
      >
        <svg
          className="toast-close-icon"
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
  );
}

export default Toast;