
import { INITIAL_ASSIGNMENTS } from "../data/initialAssignments";

const ASSIGNMENTS_STORAGE_KEY = "joineazy_assignments";

const isValidAssignments = (data) => Array.isArray(data);

export const getStoredAssignments = () => {
  try {
    const data = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);

    if (!data) {
      saveStoredAssignments(INITIAL_ASSIGNMENTS);
      return INITIAL_ASSIGNMENTS;
    }

    const parsedData = JSON.parse(data);

    if (!isValidAssignments(parsedData)) {
      saveStoredAssignments(INITIAL_ASSIGNMENTS);
      return INITIAL_ASSIGNMENTS;
    }

    return parsedData;
  } catch (error) {
    console.error("Error reading assignments:", error);
    return INITIAL_ASSIGNMENTS;
  }
};

export const saveStoredAssignments = (assignments) => {
  if (!Array.isArray(assignments)) {
    throw new Error("Assignments must be an array.");
  }

  try {
    localStorage.setItem(
      ASSIGNMENTS_STORAGE_KEY,
      JSON.stringify(assignments)
    );
    return true;
  } catch (error) {
    console.error("Error saving assignments:", error);
    throw new Error("Unable to save assignments. Please try again.");
  }
};

export const updateStudentSubmission = (
  assignmentId,
  studentId,
  status = "Submitted"
) => {
  const assignments = getStoredAssignments();

  const updatedAssignments = assignments.map((assignment) => {
    if (assignment.id !== assignmentId) return assignment;

    if (!assignment.assignedTo?.includes(studentId)) {
      return assignment;
    }

    const submissions = Array.isArray(assignment.submissions)
      ? assignment.submissions
      : [];

    const existing = submissions.find(
      (submission) => submission.studentId === studentId
    );

    const updatedSubmission = {
      studentId,
      status,
      submittedAt: new Date().toISOString(),
    };

    return {
      ...assignment,
      submissions: existing
        ? submissions.map((submission) =>
            submission.studentId === studentId
              ? updatedSubmission
              : submission
          )
        : [...submissions, updatedSubmission],
    };
  });

  saveStoredAssignments(updatedAssignments);
  return updatedAssignments;
};

export const createStoredAssignment = (assignmentData) => {
  const assignments = getStoredAssignments();

  const assignedTo = [
    ...new Set(
      Array.isArray(assignmentData.assignedTo)
        ? assignmentData.assignedTo
        : []
    ),
  ];

  const newAssignment = {
    ...assignmentData,
    id: `asg-${Date.now()}`,
    assignedTo,
    submissions: assignedTo.map((studentId) => ({
      studentId,
      status: "Pending",
      submittedAt: null,
    })),
    createdAt: new Date().toISOString(),
  };

  const updatedAssignments = [newAssignment, ...assignments];

  saveStoredAssignments(updatedAssignments);
  return updatedAssignments;
};

export const updateStoredAssignment = (assignmentId, updates) => {
  const assignments = getStoredAssignments();
  const { fallbackSubmissions, ...assignmentUpdates } = updates;

  const updatedAssignments = assignments.map((assignment) => {
    if (assignment.id !== assignmentId) return assignment;

    const assignedTo = [
      ...new Set(
        Array.isArray(assignmentUpdates.assignedTo)
          ? assignmentUpdates.assignedTo
          : assignment.assignedTo || []
      ),
    ];

    const previousSubmissions =
      Array.isArray(assignment.submissions) &&
      assignment.submissions.length > 0
        ? assignment.submissions
        : Array.isArray(fallbackSubmissions)
          ? fallbackSubmissions
          : [];

    const submissions = assignedTo.map((studentId) => {
      const existing = previousSubmissions.find(
        (submission) => submission.studentId === studentId
      );

      return existing
        ? {
            studentId,
            status: existing.status || "Pending",
            submittedAt: existing.submittedAt || null,
          }
        : {
            studentId,
            status: "Pending",
            submittedAt: null,
          };
    });

    return {
      ...assignment,
      ...assignmentUpdates,
      id: assignment.id,
      createdBy: assignment.createdBy,
      createdAt: assignment.createdAt,
      assignedTo,
      submissions,
    };
  });

  saveStoredAssignments(updatedAssignments);
  return updatedAssignments;
};

export const deleteStoredAssignment = (assignmentId) => {
  const assignments = getStoredAssignments();

  const updatedAssignments = assignments.filter(
    (assignment) => assignment.id !== assignmentId
  );

  saveStoredAssignments(updatedAssignments);
  return updatedAssignments;
};

export const resetToInitialAssignments = () => {
  saveStoredAssignments(INITIAL_ASSIGNMENTS);
  return INITIAL_ASSIGNMENTS;
};
