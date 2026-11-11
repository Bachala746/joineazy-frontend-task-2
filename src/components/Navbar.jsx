
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { user, logout, switchDemoRole } = useAuth();
  const { activeCourse } = useApp();

  if (!user) return null;

  const isProfessor = user.role === "professor";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
            J
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Joineazy
            </h1>
            <p className="text-xs text-slate-500">
              {isProfessor ? "Professor Portal" : "Student Portal"}
            </p>
          </div>
        </div>

        {/* User details */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {user.name}
            </p>
            <p className="text-xs text-slate-500">
              {user.email}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-700">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {/* Demo role switcher */}
          <select
            aria-label="Switch demo role"
            value={user.role}
            onChange={(event) => switchDemoRole(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 outline-none focus:border-indigo-500"
          >
            <option value="professor">Professor</option>
            <option value="student">Student</option>
          </select>

          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {activeCourse && (
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 sm:px-6">
          <p className="mx-auto max-w-7xl text-xs text-slate-600">
            Current course:{" "}
            <span className="font-semibold text-indigo-700">
              {activeCourse.name || activeCourse.title || activeCourse.code}
            </span>
          </p>
        </div>
      )}
    </header>
  );
}
