import React from "react";

export default function DrillDownModal({
  isOpen,
  onClose,
  assignment,
  tracking,
  users,
}) {
  if (!isOpen || !assignment) return null;

  const submitted = tracking?.submitted || [];
  const pending = tracking?.pending || [];

  const getName = (id) =>
    users.find((user) => user.id === id)?.name || "Unknown Student";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Submission Tracking
          </h2>
          <button onClick={onClose} className="text-2xl">
            ×
          </button>
        </div>

        <h3 className="mb-4 font-semibold text-slate-700">
          {assignment.title}
        </h3>

        <div className="mb-5 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-sm text-green-700">Submitted</p>
            <p className="text-2xl font-bold text-green-800">
              {submitted.length}
            </p>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-sm text-amber-700">Pending</p>
            <p className="text-2xl font-bold text-amber-800">
              {pending.length}
            </p>
          </div>
        </div>

        <h3 className="mb-3 font-bold text-green-700">
          Submitted
        </h3>

        {submitted.map((item, index) => (
          <div key={item.group?.id || item.studentId || index}
            className="mb-2 rounded-lg border p-3 text-sm">
            {item.group
              ? `${item.group.name} (${item.members.length} members)`
              : getName(item.studentId)}
            <span className="float-right font-semibold text-green-600">
              Submitted
            </span>
          </div>
        ))}

        <h3 className="mb-3 mt-5 font-bold text-amber-700">
          Pending
        </h3>

        {pending.map((item, index) => (
          <div key={item.group?.id || item.studentId || index}
            className="mb-2 rounded-lg border p-3 text-sm">
            {item.group
              ? `${item.group.name} (${item.members.length} members)`
              : getName(item.studentId)}
            <span className="float-right font-semibold text-amber-600">
              Pending
            </span>
          </div>
        ))}

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}