import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { CourseCard } from '../components/courses/CourseCard';
import { Icon } from '../components/common/Icons';

export const CoursesDashboard = ({ onSelectCourse }) => {
  const { user } = useAuth();
  const { getCoursesForUser } = useApp();

  const userCourses = getCoursesForUser();
  const isProfessor = user?.role === 'professor';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-md text-indigo-300">
            {isProfessor ? 'Professor Academic Portal' : 'Student Dashboard'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-3">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {isProfessor
              ? 'Select a course you teach to manage assignments, monitor submissions, and track class progress.'
              : 'Select one of your enrolled courses this semester to track deadlines, manage group projects, and submit work.'}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl">
          <div className="text-center">
            <div className="text-2xl font-black">{userCourses.length}</div>
            <div className="text-[10px] uppercase font-bold text-slate-300">
              {isProfessor ? 'Courses Taught' : 'Enrolled Courses'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Icon name="book" className="w-5 h-5 text-indigo-600" />
          <span>{isProfessor ? 'Courses You Teach' : 'Your Enrolled Courses'}</span>
        </h2>
      </div>

      {userCourses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <Icon name="book" className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700">No courses available</h3>
          <p className="text-xs text-slate-500 mt-1">You are currently not assigned to any courses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              role={user.role}
              onSelectCourse={onSelectCourse}
            />
          ))}
        </div>
      )}
    </div>
  );
};