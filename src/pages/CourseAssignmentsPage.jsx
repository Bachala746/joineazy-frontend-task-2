
import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

import AssignmentCard from "../components/assignments/AssignmentCard";
import AssignmentModal from "../components/assignments/AssignmentModal";
import GroupManagerModal from "../components/groups/GroupManagerModal";
import DrillDownModal from "../components/assignments/DrillDownModal";

export default function CourseAssignmentsPage({ onBack }) {
  const { user } = useAuth();

  const {
    courses,
    assignments,
    users,
    activeCourse,
    setActiveCourse,
    deleteAssignment,
    getAssignmentTracking,
  } = useApp();

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [trackingAssignment, setTrackingAssignment] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const course = activeCourse || courses.find(
    (item) => item.id === new URLSearchParams(window.location.search).get("courseId")
  ) || courses.find((item) =>
    user?.role === "professor"
      ? item.professorId === user.id
      : item.studentIds?.includes(user.id)
  );

  const courseAssignments = useMemo(() => {
    if (!course) return [];

    return assignments
      .filter((assignment) => assignment.courseId === course.id)
      .filter((assignment) => {
        const matchesSearch =
          assignment.title?.toLowerCase().includes(search.toLowerCase()) ||
          assignment.description?.toLowerCase().includes(search.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === "individual") {
          return assignment.submissionType?.toLowerCase() === "individual";
        }

        if (filter === "group") {
          return assignment.submissionType?.toLowerCase() === "group";
        }

        return true;
      });
  }, [course, assignments, search, filter]);

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setShowAssignmentModal(true);
  };

  const handleCloseAssignmentModal = () => {
    setShowAssignmentModal(false);
    setEditingAssignment(null);
  };

  const handleDelete = (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      deleteAssignment(assignmentId);
    }
  };

  const tracking = trackingAssignment
    ? getAssignmentTracking(trackingAssignment.id)
    : null;

  if (!course) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <button
          onClick={() => {
            setActiveCourse(null);
            onBack?.();
          }}
          className="mb-5 text-sm font-semibold text-indigo-600 hover:underline"
        >
          ← Back
        </button>
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="text-xl font-bold text-slate-800">
            Course not found
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Select a course from your dashboard to view assignments.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <button
        onClick={() => {
          setActiveCourse(null);
          onBack?.();
        }}
        className="mb-5 text-sm font-semibold text-indigo-600 hover:underline"
      >
        ← Back to Courses
      </button>

      <section className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            {course.code || course.id}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            {course.name || course.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {course.description || "Course assignments and submissions"}
          </p>
        </div>

        {user?.role === "professor" && (
          <button
            onClick={() => setShowAssignmentModal(true)}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            + Create Assignment
          </button>
        )}

        {user?.role === "student" && (
          <button
            onClick={() => setShowGroupModal(true)}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
          >
            Manage Groups
          </button>
        )}
      </section>

      <section className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search assignments..."
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
        />

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
        >
          <option value="all">All Assignments</option>
          <option value="individual">Individual</option>
          <option value="group">Group</option>
        </select>
      </section>

      {courseAssignments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <h2 className="text-lg font-semibold text-slate-800">
            No assignments found
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {search
              ? "Try a different search term."
              : "Assignments for this course will appear here."}
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {courseAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onEdit={user?.role === "professor" ? handleEdit : undefined}
              onDelete={user?.role === "professor" ? handleDelete : undefined}
              onViewTracking={
                user?.role === "professor"
                  ? (item) => setTrackingAssignment(item)
                  : undefined
              }
              onManageGroups={() => setShowGroupModal(true)}
            />
          ))}
        </section>
      )}

      <AssignmentModal
        isOpen={showAssignmentModal}
        onClose={handleCloseAssignmentModal}
        courseId={course.id}
        assignment={editingAssignment}
      />

      <GroupManagerModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        courseId={course.id}
      />

      {trackingAssignment && (
        <DrillDownModal
          isOpen={true}
          onClose={() => setTrackingAssignment(null)}
          assignment={trackingAssignment}
          tracking={tracking}
          users={users}
        />
      )}
    </main>
  );
}
