
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

export default function AssignmentCard({
  assignment,
  onEdit,
  onDelete,
  onViewTracking,
  onManageGroups,
}) {
  const { user } = useAuth();

  const {
    users,
    getStudentGroup,
    getSubmissionStatus,
    acknowledgeSubmission,
    getAssignmentTracking,
    showToast,
  } = useApp();

  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!assignment || !user) return null;

  const isProfessor = user.role === "professor";
  const isGroup = assignment.submissionType?.toLowerCase() === "group";

  const group = !isProfessor && isGroup
    ? getStudentGroup(user.id, assignment.courseId)
    : null;

  const submission = !isProfessor
    ? getSubmissionStatus(assignment, user.id)
    : null;

  const tracking = isProfessor
    ? getAssignmentTracking(assignment.id)
    : null;

  const acknowledged = isProfessor
    ? tracking?.pending?.length === 0 && tracking?.total > 0
    : submission?.status === "Submitted";

  const deadline = assignment.deadline
    ? new Date(assignment.deadline)
    : null;

  const validDeadline =
    deadline && !Number.isNaN(deadline.getTime());

  const overdue =
    validDeadline &&
    deadline.getTime() < Date.now() &&
    (isProfessor
      ? (tracking?.pending?.length || 0) > 0
      : !acknowledged);

  const total = tracking?.total || 0;
  const submittedCount = tracking?.submitted?.length || 0;
  const percentage = total
    ? Math.round((submittedCount / total) * 100)
    : 0;

  const getName = (id) =>
    users.find((item) => item.id === id)?.name || "Unknown";

  const handleAcknowledge = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setSubmitting(true);

    try {
      const success = acknowledgeSubmission(assignment.id);

      if (success) {
        setConfirming(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const openOneDrive = () => {
    if (!assignment.oneDriveLink) return;

    try {
      const url = new URL(assignment.oneDriveLink);

      if (url.protocol === "https:") {
        window.open(url.href, "_blank", "noopener,noreferrer");
      } else {
        showToast?.("Only secure HTTPS links are allowed.", "error");
      }
    } catch {
      showToast?.("Invalid assignment link.", "error");
    }
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {assignment.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {assignment.submissionType || "Individual"} Submission
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isGroup
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {isGroup ? "Group" : "Individual"}
        </span>
      </div>

      {assignment.description && (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
          {assignment.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div>
          <p className="text-xs text-slate-500">Deadline</p>
          <p className="mt-1 font-medium text-slate-700">
            {validDeadline ? formatDate(deadline) : "Not specified"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Status</p>
          <p className={`mt-1 font-semibold ${
            acknowledged
              ? "text-green-700"
              : overdue
                ? "text-red-600"
                : "text-amber-600"
          }`}>
            {acknowledged
              ? "Acknowledged"
              : overdue
                ? "Overdue"
                : "Pending"}
          </p>
        </div>
      </div>

      {assignment.oneDriveLink && (
        <button
          type="button"
          onClick={openOneDrive}
          className="mt-4 text-sm font-semibold text-indigo-600 hover:underline"
        >
          Open OneDrive Assignment ↗
        </button>
      )}

      {isProfessor ? (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium text-slate-700">
              Submission Progress
            </span>
            <span className="font-semibold text-indigo-700">
              {submittedCount}/{total}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            {percentage}% completed
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {onViewTracking && (
              <button
                onClick={() => onViewTracking(assignment)}
                className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                View Submissions
              </button>
            )}

            {onEdit && (
              <button
                onClick={() => onEdit(assignment)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(assignment.id)}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-5 border-t border-slate-100 pt-4">
          {isGroup && !group ? (
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-sm text-amber-800">
                You are not part of any group. Create or join one to submit this assignment.
              </p>

              {onManageGroups && (
                <button
                  onClick={onManageGroups}
                  className="mt-3 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                >
                  Create or Join Group
                </button>
              )}
            </div>
          ) : acknowledged ? (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
              <p className="font-semibold">
                <span className="mr-1">✓</span>
                Acknowledged
              </p>

              {isGroup ? (
                <p className="mt-1">
                  Acknowledged by {getName(submission.acknowledgedBy)} on{" "}
                  {formatDate(submission.acknowledgedAt)}
                </p>
              ) : (
                <p className="mt-1">
                  Submitted on {formatDate(submission.submittedAt)}
                </p>
              )}
            </div>
          ) : (
            <>
              {isGroup && (
                <p className="mb-3 text-sm text-slate-600">
                  Group: <strong>{group.name}</strong>
                  {group.leaderId === user.id
                    ? " (You are the group leader)"
                    : " (Only the group leader can acknowledge)"}
                </p>
              )}

              {(!isGroup || group?.leaderId === user.id) && (
                <>
                  {confirming && (
                    <p className="mb-3 text-sm text-slate-600">
                      Confirm that you have completed and submitted this assignment.
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleAcknowledge}
                      disabled={submitting}
                      className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {submitting
                        ? "Processing..."
                        : confirming
                          ? "Confirm Submission"
                          : "Acknowledge Submission"}
                    </button>

                    {confirming && (
                      <button
                        onClick={() => setConfirming(false)}
                        className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </article>
  );
}
