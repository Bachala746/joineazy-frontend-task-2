
export const INITIAL_USERS = [
  {
    id: "prof_1",
    name: "Demo Professor",
    email: "professor@joineazy.com",
    password: "password123",
    role: "professor",
    department: "Computer Science",
  },
  {
    id: "stud_1",
    name: "Demo Student",
    email: "student@joineazy.com",
    password: "password123",
    role: "student",
    department: "Computer Science",
  },
  {
    id: "stud_2",
    name: "Student Two",
    email: "student2@joineazy.com",
    password: "password123",
    role: "student",
    department: "Computer Science",
  },
  {
    id: "stud_3",
    name: "Student Three",
    email: "student3@joineazy.com",
    password: "password123",
    role: "student",
    department: "Computer Science",
  },
];

export const INITIAL_COURSES = [
  {
    id: "CS101",
    code: "CS101",
    name: "Introduction to Computer Science",
    description: "Fundamentals of computer science and programming.",
    professorId: "prof_1",
    studentIds: ["stud_1", "stud_2", "stud_3"],
    semester: "Fall 2026",
  },
  {
    id: "CS102",
    code: "CS102",
    name: "Web Development",
    description: "Frontend and backend web development fundamentals.",
    professorId: "prof_1",
    studentIds: ["stud_1", "stud_2", "stud_3"],
    semester: "Fall 2026",
  },
];

export const INITIAL_GROUPS = [];

export const INITIAL_ASSIGNMENTS = [
  {
    id: "asg_1",
    courseId: "CS101",
    title: "Programming Fundamentals",
    description: "Complete the basic programming exercises.",
    deadline: "2026-11-20T23:59",
    oneDriveLink: "https://onedrive.live.com/",
    submissionType: "Individual",
    assignedTo: ["stud_1", "stud_2", "stud_3"],
    createdBy: "prof_1",
    createdAt: new Date().toISOString(),
    submissions: [
      {
        studentId: "stud_1",
        status: "Submitted",
        submittedAt: new Date().toISOString(),
      },
      {
        studentId: "stud_2",
        status: "Pending",
        submittedAt: null,
      },
      {
        studentId: "stud_3",
        status: "Pending",
        submittedAt: null,
      },
    ],
  },
  {
    id: "asg_2",
    courseId: "CS102",
    title: "Build a Responsive Website",
    description: "Create a responsive website using HTML, CSS and JavaScript.",
    deadline: "2026-11-25T23:59",
    oneDriveLink: "https://onedrive.live.com/",
    submissionType: "Group",
    assignedTo: ["stud_1", "stud_2", "stud_3"],
    createdBy: "prof_1",
    createdAt: new Date().toISOString(),
    submissions: [],
  },
];
