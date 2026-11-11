
import React, { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

export default function AssignmentModal({
  isOpen,
  onClose,
  courseId,
  assignment = null,
}) {
  const { createAssignment, updateAssignment, users } = useApp();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    oneDriveLink: "",
    submissionType: "Individual",
    assignedTo: [],
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (assignment) {
      setForm({
        title: assignment.title || "",
        description: assignment.description || "",
        deadline: assignment.deadline || "",
        oneDriveLink: assignment.oneDriveLink || "",
        submissionType: assignment.submissionType || "Individual",
        assignedTo: assignment.assignedTo || [],
      });
    } else {
      setForm({
        title: "",
        description: "",
        deadline: "",
        oneDriveLink: "",
        submissionType: "Individual",
        assignedTo: [],
      });
    }

    setError("");
  }, [isOpen, assignment]);

  if (!isOpen || user?.role !== "professor") return null;

  const courseStudents = users.filter(
    (item) => item.role === "student"
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const toggleStudent = (studentId) => {
    setForm((previous) => ({
      ...previous,
      assignedTo: previous.assignedTo.includes(studentId)
        ? previous.assignedTo.filter((id) => id !== studentId)
        : [...previous.assignedTo, studentId],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.deadline) {
      setError("Please enter the title and deadline.");
      return;
    }

    if (new Date(form.deadline) <= new Date()) {
      setError("Please select a future deadline.");
      return;
    }

    if (
      form.oneDriveLink &&
      !/^https:\/\/.+/i.test(form.oneDriveLink.trim())
    ) {
      setError("Please enter a valid HTTPS OneDrive link.");
      return;
    }

    if (form.assignedTo.length === 0) {
      setError("Please assign this task to at least one student.");
      return;
    }

    const data = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      oneDriveLink: form.oneDriveLink.trim(),
      courseId,
      createdBy: user.id,
    };

    const success = assignment
      ? updateAssignment(assignment.id, data)
      : createAssignment(data);

    if (success) onClose();
    else setError("Unable to save assignment. Please try again.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {assignment ? "Edit Assignment" : "Create Assignment"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-500 hover:text-slate-800"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Assignment Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="Enter assignment title"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the assignment..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Deadline *
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              OneDrive Link (optional)
            </label>
            <input
              type="url"
              name="oneDriveLink"
              value={form.oneDriveLink}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Submission Type
            </label>
            <select
              name="submissionType"
              value={form.submissionType}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500"
            >
              <option value="Individual">Individual</option>
              <option value="Group">Group</option>
            </select>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                Assign to Students *
              </label>
              <button
                type="button"
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    assignedTo:
                      previous.assignedTo.length === courseStudents.length
                        ? []
                        : courseStudents.map((student) => student.id),
                  }))
                }
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                {form.assignedTo.length === courseStudents.length
                  ? "Clear All"
                  : "Select All"}
              </button>
            </div>

            <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
              {courseStudents.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No students are registered.
                </p>
              ) : (
                courseStudents.map((student) => (
                  <label
                    key={student.id}
                    className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={form.assignedTo.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className="h-4 w-4 accent-indigo-600"
                    />
                    {student.name} ({student.email})
                  </label>
                ))
              )}
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700"
            >
              {assignment ? "Save Changes" : "Create Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
