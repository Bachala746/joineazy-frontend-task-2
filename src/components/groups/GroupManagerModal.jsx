
import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

export default function GroupManagerModal({ isOpen, onClose, courseId }) {
  const { user } = useAuth();
  const { groups, users, createGroup, joinGroup, getStudentGroup } = useApp();

  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  if (!user || user.role !== "student") return null;

  const myGroup = getStudentGroup(user.id, courseId);

  const availableGroups = groups.filter(
    (group) =>
      group.courseId === courseId &&
      !group.memberIds?.includes(user.id)
  );

  const handleCreate = (event) => {
    event.preventDefault();
    setError("");

    const success = createGroup(groupName, courseId);

    if (success) {
      setGroupName("");
      onClose();
    } else {
      setError("Unable to create group. Check whether you already belong to one.");
    }
  };

  const handleJoin = (groupId) => {
    const success = joinGroup(groupId);

    if (success) onClose();
    else setError("Unable to join this group.");
  };

  const getName = (id) =>
    users.find((item) => item.id === id)?.name || "Unknown member";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Manage Groups
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-xl text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {myGroup ? (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
            <h3 className="font-semibold text-indigo-900">
              {myGroup.name}
            </h3>
            <p className="mt-1 text-sm text-indigo-700">
              Leader: {getName(myGroup.leaderId)}
            </p>

            <p className="mt-3 text-sm font-semibold text-slate-700">
              Members ({myGroup.memberIds?.length || 0})
            </p>

            <ul className="mt-2 space-y-2">
              {(myGroup.memberIds || []).map((memberId) => (
                <li
                  key={memberId}
                  className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm"
                >
                  <span>{getName(memberId)}</span>
                  {memberId === myGroup.leaderId && (
                    <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-700">
                      Leader
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <form onSubmit={handleCreate} className="space-y-3">
              <h3 className="font-semibold text-slate-800">
                Create a new group
              </h3>
              <input
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                placeholder="Enter group name"
                required
                maxLength={40}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700"
              >
                Create Group
              </button>
            </form>

            <div className="my-5 border-t border-slate-200" />

            <h3 className="mb-3 font-semibold text-slate-800">
              Join an existing group
            </h3>

            {availableGroups.length === 0 ? (
              <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                No available groups in this course.
              </p>
            ) : (
              <div className="space-y-3">
                {availableGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">
                        {group.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Leader: {getName(group.leaderId)} ·{" "}
                        {group.memberIds?.length || 0} members
                      </p>
                    </div>

                    <button
                      onClick={() => handleJoin(group.id)}
                      className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                    >
                      Join
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg border border-slate-300 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
        >
          Close
        </button>
      </div>
    </div>
  );
}
