export const INITIAL_ASSIGNMENTS = [
  {
    id: "asg-1",
    title: "Responsive Portfolio Website",
    description:
      "Design and develop a personal developer portfolio using React and Tailwind CSS. Ensure mobile responsiveness and cross-browser compatibility.",
    dueDate: "2026-10-28", // Past date (for testing overdue indicator)
    driveLink: "https://drive.google.com/drive/folders/1examplePortfolioFolder01",
    createdBy: "admin-1", // Prof. Alan Turing
    assignedTo: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
    submissions: [
      {
        studentId: "student-1",
        status: "Submitted",
        submittedAt: "2026-10-27",
      },
      {
        studentId: "student-2",
        status: "Submitted",
        submittedAt: "2026-10-28",
      },
      {
        studentId: "student-3",
        status: "Pending",
        submittedAt: null,
      },
      {
        studentId: "student-4",
        status: "Submitted",
        submittedAt: "2026-10-26",
      },
      {
        studentId: "student-5",
        status: "Pending",
        submittedAt: null,
      },
    ],
  },
  {
    id: "asg-2",
    title: "State Management with React Hooks",
    description:
      "Build a task tracking dashboard using useState, useEffect, and localStorage persistence without third-party state libraries.",
    dueDate: "2026-11-12",
    driveLink: "https://drive.google.com/drive/folders/1exampleHooksFolder02",
    createdBy: "admin-1", // Prof. Alan Turing
    assignedTo: ["student-1", "student-2", "student-3"],
    submissions: [
      {
        studentId: "student-1",
        status: "Submitted",
        submittedAt: "2026-11-02",
      },
      {
        studentId: "student-2",
        status: "Pending",
        submittedAt: null,
      },
      {
        studentId: "student-3",
        status: "Pending",
        submittedAt: null,
      },
    ],
  },
  {
    id: "asg-3",
    title: "REST API Integration & Error States",
    description:
      "Fetch user and post data from a public REST API. Implement clean loading states, empty states, and toast notifications for errors.",
    dueDate: "2026-11-18",
    driveLink: "https://drive.google.com/drive/folders/1exampleApiFolder03",
    createdBy: "admin-1", // Prof. Alan Turing
    assignedTo: ["student-1", "student-2", "student-4", "student-5"],
    submissions: [
      {
        studentId: "student-1",
        status: "Pending",
        submittedAt: null,
      },
      {
        studentId: "student-2",
        status: "Submitted",
        submittedAt: "2026-11-03",
      },
      {
        studentId: "student-4",
        status: "Pending",
        submittedAt: null,
      },
      {
        studentId: "student-5",
        status: "Pending",
        submittedAt: null,
      },
    ],
  },
  {
    id: "asg-4",
    title: "Algorithm Visualizer in JavaScript",
    description:
      "Implement sorting algorithms (Bubble Sort, Merge Sort) with visual animations and step-by-step execution controls.",
    dueDate: "2026-11-02", // Past date (for testing overdue indicator)
    driveLink: "https://drive.google.com/drive/folders/1exampleAlgoFolder04",
    createdBy: "admin-2", // Prof. Ada Lovelace
    assignedTo: ["student-2", "student-3", "student-4", "student-5"],
    submissions: [
      {
        studentId: "student-2",
        status: "Submitted",
        submittedAt: "2026-11-01",
      },
      {
        studentId: "student-3",
        status: "Submitted",
        submittedAt: "2026-11-02",
      },
      {
        studentId: "student-4",
        status: "Pending",
        submittedAt: null,
      },
      {
        studentId: "student-5",
        status: "Pending",
        submittedAt: null,
      },
    ],
  },
  {
    id: "asg-5",
    title: "Database Modeling & Schema Design",
    description:
      "Create an Entity-Relationship (ER) diagram for a multi-tenant school management system and document table constraints.",
    dueDate: "2026-11-25",
    driveLink: "https://drive.google.com/drive/folders/1exampleSchemaFolder05",
    createdBy: "admin-2", // Prof. Ada Lovelace
    assignedTo: ["student-1", "student-3", "student-5"],
    submissions: [
      {
        studentId: "student-1",
        status: "Pending",
        submittedAt: null,
      },
      {
        studentId: "student-3",
        status: "Pending",
        submittedAt: null,
      },
      {
        studentId: "student-5",
        status: "Submitted",
        submittedAt: "2026-11-03",
      },
    ],
  },
];