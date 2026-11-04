# Joineazy – Assignment & Review Dashboard

A responsive web application designed to simplify assignment management and student submission tracking. The platform provides separate dashboards for professors and students, making it easier to distribute assignments, manage coursework, and monitor submission progress.

## 📌 Project Overview

The Joineazy Assignment & Review Dashboard is developed as part of the Joineazy Frontend Internship Assignment – Task 1.

The application provides two roles:

- **Professor (Admin):** Create, manage, distribute, and monitor assignments.
- **Student:** View assigned assignments, access learning materials, and track submission status.

The application uses mock authentication and browser LocalStorage for data persistence. No backend server is required.

## ✨ Features

### 👨‍🏫 Professor Dashboard

- Create new assignments with a title, description, due date, and Google Drive link.
- Edit existing assignments.
- Delete assignments with confirmation.
- Assign work to all students or select specific students.
- View the list of students assigned to each assignment.
- Track individual student submission statuses.
- Monitor overall class submission progress.
- Search assignments by title or description.
- View only assignments created by the logged-in professor.

### 🎓 Student Dashboard

- View assignments assigned specifically to the logged-in student.
- Read assignment descriptions and due dates.
- Access Google Drive learning materials.
- Submit assignments through a two-step confirmation process.
- View submitted and pending assignment statuses.
- Track overall submission progress.
- Search, filter, and sort assignments.
- Retain submission information after refreshing the browser.

### 🔐 General Features

- Mock login with predefined professor and student accounts.
- Separate dashboards based on user roles.
- Student-specific assignment visibility.
- Professor-specific assignment management.
- LocalStorage-based data persistence.
- Responsive user interface.
- Toast notifications and confirmation dialogs.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Vite | Development server and build tool |
| JavaScript | Application logic |
| HTML5 | Application structure |
| CSS3 | Styling and responsive design |
| Browser LocalStorage | Data persistence |
| Git & GitHub | Version control and source code management |

## 📂 Project Structure

```text
Joineazy/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── AssignmentCard.jsx
│   │   ├── StatsOverview.jsx
│   │   ├── SubmitModal.jsx
│   │   └── Toast.jsx
│   │
│   ├── data/
│   │   ├── initialAssignments.js
│   │   └── mockUsers.js
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AdminDashboard.css
│   │   │
│   │   └── student/
│   │       ├── StudentDashboard.jsx
│   │       └── StudentDashboard.css
│   │
│   ├── utils/
│   │   └── storage.js
│   │
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project Directory

```bash
cd Joineazy
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

### 5. Create a Production Build

```bash
npm run build
```

## 👥 Demo Accounts

The application includes predefined mock accounts for demonstration.

**Professor Accounts**

| Name | Email |
|---|---|
| Prof. Alan Turing | alan.turing@joineazy.edu |
| Prof. Ada Lovelace | ada.lovelace@joineazy.edu |

**Student Accounts**

| Name | Email |
|---|---|
| Alice Johnson | alice@student.joineazy.edu |
| Bob Smith | bob@student.joineazy.edu |
| Charlie Brown | charlie@student.joineazy.edu |
| Diana Prince | diana@student.joineazy.edu |
| Evan Wright | evan@student.joineazy.edu |

No password or real authentication is required. Select a demo profile to access its dashboard.

## 💾 Data Persistence

The application uses browser LocalStorage to store assignment information and student submission records.

- Assignment data remains available after refreshing the browser.
- Student submission statuses are saved locally.
- Each student sees only their assigned assignments.
- Each professor manages only the assignments they created.

**Note:** Data is stored locally in the browser and is not synchronized across different devices or browsers.

## 📱 Responsive Design

The dashboard is designed to provide a consistent experience across desktop, tablet, and mobile screen sizes.

## 🎯 Project Objective

The main objective is to develop a simple and user-friendly assignment management platform that helps professors distribute coursework and monitor student progress while allowing students to manage their assignments and track submissions efficiently.

## 🔗 Project Links

- **GitHub Repository:** To be added
- **Live Application:** To be added
- **Demo Video:** To be added

## 👩‍💻 Internship Assignment

**Company:** Joineazy  
**Role:** Frontend Intern  
**Task:** Task 1 – Assignment & Review Dashboard  
**Technology:** React.js

