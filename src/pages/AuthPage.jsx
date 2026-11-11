
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "Computer Science",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    if (isRegister && !form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);

    try {
      const result = isRegister
        ? register(form)
        : login(form.email, form.password, form.role);

      if (!result.success) {
        setError(result.message || "Authentication failed.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    setForm((previous) => ({
      ...previous,
      role,
      email:
        role === "professor"
          ? "professor@joineazy.com"
          : "student@joineazy.com",
      password: "password123",
    }));
    setError("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white">
            J
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome to Joineazy
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {isRegister
              ? "Create your account to get started."
              : "Sign in to access your workspace."}
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError("");
            }}
            className={`rounded-lg py-2 text-sm font-semibold transition ${
              !isRegister
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError("");
            }}
            className={`rounded-lg py-2 text-sm font-semibold transition ${
              isRegister
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              minLength={6}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Login as
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500"
            >
              <option value="student">Student</option>
              <option value="professor">Professor</option>
            </select>
          </div>

          {isRegister && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Department
              </label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Enter department"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>

        {!isRegister && (
          <div className="mt-6 border-t border-slate-200 pt-5">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
              Demo Login
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fillDemo("student")}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50"
              >
                Student Demo
              </button>

              <button
                type="button"
                onClick={() => fillDemo("professor")}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50"
              >
                Professor Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
