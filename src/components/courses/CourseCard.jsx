import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';

export const CourseCard = ({ course, role, onSelectCourse }) => {
  const { setActiveCourse, assignments } = useApp();

  const courseAssignments = assignments.filter((a) => a.courseId === course.id);
  const studentCount = course.studentIds?.length || 0;

  return (
    <div
      onClick={() => {
        setActiveCourse(course);
        onSelectCourse?.(course);
      }}
      className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-200 cursor-pointer overflow-hidden flex flex-col justify-between group"
    >
      <div>
        {/* Banner Gradient */}
        <div className={`h-24 bg-gradient-to-r ${course.color || 'from-indigo-600 to-violet-700'} p-5 text-white flex justify-between items-start`}>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md">
              {course.code}
            </span>
            <div className="text-xs font-medium text-white/80 mt-2">{course.semester}</div>
          </div>
          <span className="p-2 bg-white/20 rounded-xl group-hover:scale-110 transition">
            <Icon name="book" className="w-5 h-5 text-white" />
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1">
            {course.title}
          </h3>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-1.5">
          <Icon name="users" className="w-4 h-4 text-slate-400" />
          <span>{studentCount} Students</span>
        </div>
        <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
          <span>{courseAssignments.length} Assignments</span>
          <span>&rarr;</span>
        </div>
      </div>
    </div>
  );
};