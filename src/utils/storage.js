import { INITIAL_ASSIGNMENTS } from "../data/initialAssignments";

const ASSIGNMENTS_STORAGE_KEY = "joineazy_assignments";

/**
 * Retrieves all assignments from localStorage.
 * If none exist, seeds localStorage with INITIAL_ASSIGNMENTS.
 */
export const getStoredAssignments = () => {
  try {
    const data = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);

    if (!data) {
      localStorage.setItem(
        ASSIGNMENTS_STORAGE_KEY,
        JSON.stringify(INITIAL_ASSIGNMENTS)
      );
      return INITIAL_ASSIGNMENTS;
    }

    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading assignments from localStorage:", error);
    return INITIAL_ASSIGNMENTS;
  }
};

/**
 * Saves all assignments to localStorage.
 */
export const saveStoredAssignments = (assignments) => {
  try {
    localStorage.setItem(
      ASSIGNMENTS_STORAGE_KEY,
      JSON.stringify(assignments)
    );
  } catch (error) {
    console.error("Error saving assignments to localStorage:", error);
  }
};

/**
 * Updates a student's submission status for an assignment.
 */
export const updateStudentSubmission = (
  assignmentId,
  studentId,
  status = "Submitted"
) => {
  const currentAssignments = getStoredAssignments();

  const updatedAssignments = currentAssignments.map((assignment) => {
    if (assignment.id !== assignmentId) return assignment;

    // Verify student is actually assigned
    if (!assignment.assignedTo?.includes(studentId)) {
      return assignment;
    }

    const existingSubmissions = Array.isArray(assignment.submissions)
      ? assignment.submissions
      : [];
    const submissionIndex = existingSubmissions.findIndex(
      (sub) => sub.studentId === studentId
    );

    let updatedSubmissions;

    if (submissionIndex !== -1) {
      updatedSubmissions = existingSubmissions.map((sub, index) =>
        index === submissionIndex
          ? { ...sub, status, submittedAt: new Date().toISOString() }
          : sub
      );
    } else {
      updatedSubmissions = [
        ...existingSubmissions,
        {
          studentId,
          status,
          submittedAt: new Date().toISOString(),
        },
      ];
    }

    return {
      ...assignment,
      submissions: updatedSubmissions,
    };
  });

  saveStoredAssignments(updatedAssignments);
  return updatedAssignments;
};

/**
 * Creates a new assignment.
 * Initializes all assigned students with 'Pending' status.
 */
export const createStoredAssignment = (assignmentData) => {
  const currentAssignments = getStoredAssignments();
  const assignedTo = [...new Set(assignmentData.assignedTo || [])];

  const initialSubmissions = assignedTo.map((studentId) => ({
    studentId,
    status: "Pending",
    submittedAt: null,
  }));

  const newAssignment = {
    ...assignmentData,
    id: `asg-${Date.now()}`,
    assignedTo,
    submissions: initialSubmissions,
    createdAt: new Date().toISOString(),
  };

  const updatedAssignments = [newAssignment, ...currentAssignments];

  saveStoredAssignments(updatedAssignments);
  return updatedAssignments;
};

/**
 * Updates an existing assignment.
 *
 * Rules:
 * 1. Students who remain assigned retain their existing status and submittedAt timestamp.
 * 2. Newly assigned students receive { studentId, status: "Pending", submittedAt: null }.
 * 3. Students who are removed have their submission records removed.
 * 4. Never restores records from INITIAL_ASSIGNMENTS.
 * 5. Preserves all other assignment properties (ID, createdBy, createdAt, etc.).
 * 6. Deduplicates assigned student IDs.
 */
export const updateStoredAssignment = (assignmentId, updates) => {
  const currentAssignments = getStoredAssignments();

  const updatedAssignments = currentAssignments.map((assignment) => {
    if (assignment.id !== assignmentId) return assignment;

    // 1. Deduplicate assigned IDs
    const assignedTo = [
      ...new Set(updates.assignedTo ?? assignment.assignedTo ?? []),
    ];

    const previousSubmissions = Array.isArray(assignment.submissions)
      ? assignment.submissions
      : [];

    // 2. Build updated submissions strictly for currently assigned students
    const submissions = assignedTo.map((studentId) => {
      const existing = previousSubmissions.find(
        (sub) => sub.studentId === studentId
      );

      if (existing) {
        // Retain existing status and submittedAt
        return {
          studentId,
          status: existing.status || "Pending",
          submittedAt: existing.submittedAt || null,
        };
      }

      // Newly assigned student starts as Pending
      return {
        studentId,
        status: "Pending",
        submittedAt: null,
      };
    });

    // 3. Preserve immutable identifiers and metadata
    return {
      ...assignment,
      ...updates,
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

/**
 * Deletes an assignment by ID.
 */
export const deleteStoredAssignment = (assignmentId) => {
  const currentAssignments = getStoredAssignments();

  const updatedAssignments = currentAssignments.filter(
    (assignment) => assignment.id !== assignmentId
  );

  saveStoredAssignments(updatedAssignments);
  return updatedAssignments;
};

/**
 * Resets assignments to initial mock data.
 */
export const resetToInitialAssignments = () => {
  localStorage.setItem(
    ASSIGNMENTS_STORAGE_KEY,
    JSON.stringify(INITIAL_ASSIGNMENTS)
  );

  return INITIAL_ASSIGNMENTS;
};