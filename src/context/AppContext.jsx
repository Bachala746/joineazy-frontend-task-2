
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import {
  INITIAL_USERS,
  INITIAL_COURSES,
  INITIAL_GROUPS,
  INITIAL_ASSIGNMENTS,
} from "../data/initialData";

import {
  getStoredAssignments,
  saveStoredAssignments,
  createStoredAssignment,
  updateStoredAssignment,
  deleteStoredAssignment,
} from "../utils/storage";

const AppContext = createContext(null);

const KEYS = {
  users: "joineazy_users",
  courses: "joineazy_courses",
  groups: "joineazy_groups",
};

const readArray = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
};

export const AppProvider = ({ children }) => {
  const { user } = useAuth();

  const [users, setUsers] = useState(() =>
    readArray(KEYS.users, INITIAL_USERS)
  );

  const [courses, setCourses] = useState(() =>
    readArray(KEYS.courses, INITIAL_COURSES)
  );

  const [groups, setGroups] = useState(() =>
    readArray(KEYS.groups, INITIAL_GROUPS)
  );

  const [assignments, setAssignments] = useState(() =>
    getStoredAssignments()
  );

  const [activeCourse, setActiveCourse] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem(KEYS.users, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(KEYS.courses, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(KEYS.groups, JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    saveStoredAssignments(assignments);
  }, [assignments]);

  const showToast = useCallback((message, type = "success") => {
    const id = `${Date.now()}-${Math.random()}`;

    setToasts((previous) => [
      ...previous,
      { id, message, type },
    ]);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((previous) =>
      previous.filter((toast) => toast.id !== id)
    );
  }, []);

  const createAssignment = useCallback((data) => {
    try {
      const updated = createStoredAssignment(data);
      setAssignments(updated);
      showToast("Assignment created successfully.");
      return true;
    } catch (error) {
      showToast(error.message || "Unable to create assignment.", "error");
      return false;
    }
  }, [showToast]);

  const updateAssignment = useCallback((id, updates) => {
    try {
      const updated = updateStoredAssignment(id, updates);
      setAssignments(updated);
      showToast("Assignment updated successfully.");
      return true;
    } catch (error) {
      showToast(error.message || "Unable to update assignment.", "error");
      return false;
    }
  }, [showToast]);

  const deleteAssignment = useCallback((id) => {
    try {
      const updated = deleteStoredAssignment(id);
      setAssignments(updated);
      showToast("Assignment deleted successfully.");
      return true;
    } catch (error) {
      showToast("Unable to delete assignment.", "error");
      return false;
    }
  }, [showToast]);

  const getStudentGroup = useCallback((studentId, courseId) => {
    return groups.find(
      (group) =>
        group.courseId === courseId &&
        group.memberIds?.includes(studentId)
    ) || null;
  }, [groups]);

  const createGroup = useCallback((name, courseId) => {
    if (!user || user.role !== "student") {
      showToast("Only students can create groups.", "error");
      return false;
    }

    if (!name?.trim() || !courseId) {
      showToast("Enter a group name.", "error");
      return false;
    }

    if (!courses.some((course) => course.id === courseId)) {
      showToast("Course not found.", "error");
      return false;
    }

    if (getStudentGroup(user.id, courseId)) {
      showToast("You already belong to a group in this course.", "error");
      return false;
    }

    const newGroup = {
      id: `group_${Date.now()}`,
      name: name.trim(),
      courseId,
      leaderId: user.id,
      memberIds: [user.id],
      createdAt: new Date().toISOString(),
    };

    setGroups((previous) => [...previous, newGroup]);
    showToast("Group created successfully.");
    return true;
  }, [user, courses, getStudentGroup, showToast]);

  const joinGroup = useCallback((groupId) => {
    if (!user || user.role !== "student") return false;

    const targetGroup = groups.find((group) => group.id === groupId);

    if (!targetGroup) {
      showToast("Group not found.", "error");
      return false;
    }

    if (getStudentGroup(user.id, targetGroup.courseId)) {
      showToast("You already belong to a group in this course.", "error");
      return false;
    }

    setGroups((previous) =>
      previous.map((group) =>
        group.id === groupId
          ? {
              ...group,
              memberIds: [...(group.memberIds || []), user.id],
            }
          : group
      )
    );

    showToast("You joined the group successfully.");
    return true;
  }, [user, groups, getStudentGroup, showToast]);

  const acknowledgeSubmission = useCallback((assignmentId) => {
    if (!user || user.role !== "student") return false;

    const assignment = assignments.find(
      (item) => item.id === assignmentId
    );

    if (!assignment || !assignment.assignedTo?.includes(user.id)) {
      showToast("You are not assigned to this assignment.", "error");
      return false;
    }

    const now = new Date().toISOString();
    const submissionType = assignment.submissionType?.toLowerCase();

    let updatedSubmissions = [
      ...(assignment.submissions || []),
    ];

    if (submissionType === "group") {
      const group = getStudentGroup(user.id, assignment.courseId);

      if (!group) {
        showToast("You are not part of a group.", "error");
        return false;
      }

      if (group.leaderId !== user.id) {
        showToast("Only the group leader can acknowledge.", "error");
        return false;
      }

      const alreadyAcknowledged = updatedSubmissions.some(
        (item) => item.groupId === group.id
      );

      if (alreadyAcknowledged) {
        showToast("This group has already acknowledged.", "info");
        return false;
      }

      updatedSubmissions.push({
        groupId: group.id,
        studentId: user.id,
        acknowledgedBy: user.id,
        acknowledgedAt: now,
        status: "Submitted",
        submittedAt: now,
      });
    } else {
      const existing = updatedSubmissions.find(
        (item) => item.studentId === user.id
      );

      if (existing?.status === "Submitted") {
        showToast("Already acknowledged.", "info");
        return false;
      }

      updatedSubmissions = [
        ...updatedSubmissions.filter(
          (item) => item.studentId !== user.id
        ),
        {
          studentId: user.id,
          acknowledgedBy: user.id,
          acknowledgedAt: now,
          status: "Submitted",
          submittedAt: now,
        },
      ];
    }

    const updated = assignments.map((item) =>
      item.id === assignmentId
        ? { ...item, submissions: updatedSubmissions }
        : item
    );

    setAssignments(updated);
    saveStoredAssignments(updated);
    showToast("Assignment acknowledged successfully.");
    return true;
  }, [user, assignments, getStudentGroup, showToast]);

  const getSubmissionStatus = useCallback((assignment, studentId) => {
    if (!assignment) return null;

    const submissions = assignment.submissions || [];

    if (assignment.submissionType?.toLowerCase() === "group") {
      const group = getStudentGroup(studentId, assignment.courseId);

      if (!group) return null;

      return submissions.find(
        (item) => item.groupId === group.id
      ) || null;
    }

    return submissions.find(
      (item) => item.studentId === studentId
    ) || null;
  }, [getStudentGroup]);


  const getAssignmentTracking = useCallback((assignmentId) => {
    const assignment = assignments.find(
      (item) => item.id === assignmentId
    );

    if (!assignment) {
      return { submitted: [], pending: [], total: 0 };
    }

    const submitted = [];
    const pending = [];

    if (assignment.submissionType?.toLowerCase() === "group") {
      const assignedStudentIds = assignment.assignedTo || [];

      // Count only groups containing students assigned to this assignment.
      const courseGroups = groups.filter(
        (group) =>
          group.courseId === assignment.courseId &&
          (group.memberIds || []).some((id) =>
            assignedStudentIds.includes(id)
          )
      );

      courseGroups.forEach((group) => {
        const submission = (assignment.submissions || []).find(
          (item) => item.groupId === group.id
        );

        const entry = {
          group,
          members: group.memberIds || [],
          submission,
        };

        if (submission) submitted.push(entry);
        else pending.push(entry);
      });
    } else {
      (assignment.assignedTo || []).forEach((studentId) => {
        const submission = (assignment.submissions || []).find(
          (item) => item.studentId === studentId
        );

        const entry = {
          student: users.find((item) => item.id === studentId),
          studentId,
          submission,
        };

        if (submission?.status === "Submitted") submitted.push(entry);
        else pending.push(entry);
      });
    }

    return {
      submitted,
      pending,
      total: submitted.length + pending.length,
    };
  }, [assignments, groups, users]);


  const getCoursesForUser = useCallback(() => {
    if (!user) return [];

    if (user.role === "professor") {
      return courses.filter((course) => course.professorId === user.id);
    }

    return courses.filter((course) =>
      course.studentIds?.includes(user.id)
    );
  }, [user, courses]);

  const value = useMemo(() => ({
    user,
    users,
    courses,
    groups,
    assignments,
    activeCourse,
    setActiveCourse,
    toasts,
    showToast,
    removeToast,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    createGroup,
    joinGroup,
    getStudentGroup,
    acknowledgeSubmission,
    getSubmissionStatus,
    getAssignmentTracking,
    getCoursesForUser,
  }), [
    user, users, courses, groups, assignments, activeCourse,
    toasts, showToast, removeToast, createAssignment,
    updateAssignment, deleteAssignment, createGroup, joinGroup,
    getStudentGroup, acknowledgeSubmission, getSubmissionStatus,
    getAssignmentTracking,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
};
