import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import DeleteAlertDialog from "./delete-alert-dialog";
import { toast } from "react-toastify";

export interface Problem {
  problem_id: number;
  problem_name: string;
  problem_link: string;
  platform: string;
  level: string;
  status: string;
  language: string;
  code?: string;
  created_at: string;
  updated_at: string;
  // note?: string; // to be added later
}

interface ProblemListProps {
  problems: Problem[];
  onDelete?: (problemId: number) => void;
}

const statusOptions = ["Unsolved", "Attempted", "Solved"];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

const ProblemList: React.FC<ProblemListProps> = ({ problems, onDelete }) => {
  const [editedStatus, setEditedStatus] = useState<{ [key: number]: string }>(
    {}
  );
  const [saveEnabled, setSaveEnabled] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [saving, setSaving] = useState<{ [key: number]: boolean }>({});

  const handleStatusChange = (problemId: number, newStatus: string) => {
    setEditedStatus((prev) => ({ ...prev, [problemId]: newStatus }));
    setSaveEnabled((prev) => ({ ...prev, [problemId]: true }));
  };

  const handleSave = async (problemId: number) => {
    const newStatus = editedStatus[problemId];
    setSaving((prev) => ({ ...prev, [problemId]: true }));
    try {
      const res = await fetch("/api/problem", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ problem_id: problemId, status: newStatus }),
      });
      const result = await res.json();
      if (res.ok) {
        setSaveEnabled((prev) => ({ ...prev, [problemId]: false }));
        toast.success("Status updated successfully");
      } else {
        toast.error(
          result.error || res.statusText || "Failed to update status"
        );
      }
    } catch (err) {
      toast.error("Error updating status");
    } finally {
      setSaving((prev) => ({ ...prev, [problemId]: false }));
    }
  };

  const handleDelete = (problemId: number) => {
    if (onDelete) onDelete(problemId);
  };

  return (
    <div className="overflow-x-auto m-4">
      <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Platform</th>
            <th className="px-4 py-2">Level</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Note</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Updated At</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem.problem_id} className="border-t">
              <td className="px-4 py-2">
                <a
                  href={problem.problem_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {problem.problem_name}
                </a>
              </td>
              <td className="px-4 py-2">{problem.platform}</td>
              <td className="px-4 py-2">{problem.level}</td>
              <td className="px-4 py-2">
                <select
                  value={editedStatus[problem.problem_id] ?? problem.status}
                  onChange={(e) =>
                    handleStatusChange(problem.problem_id, e.target.value)
                  }
                  className="border rounded px-2 py-1 bg-white dark:bg-gray-900 text-black dark:text-white"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2 text-center">
                {/* Code icon: yellow if code exists, white if not */}
                <span title="Code">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={
                      problem.code && problem.code.trim() ? "#facc15" : "white"
                    }
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M8 12l2-2-2-2" />
                    <path d="M16 12l-2 2 2 2" />
                  </svg>
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                {/* Note icon: white if no note, yellow if note exists (placeholder) */}
                <span title="Note">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={"white"}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
              </td>
              <td className="px-4 py-2">{formatDate(problem.created_at)}</td>
              <td className="px-4 py-2">{formatDate(problem.updated_at)}</td>
              <td className="px-4 py-2 flex gap-2">
                <DeleteAlertDialog
                  problemId={problem.problem_id}
                  onDelete={handleDelete}
                />
                <Button
                  variant="default"
                  size="sm"
                  disabled={
                    !saveEnabled[problem.problem_id] ||
                    saving[problem.problem_id]
                  }
                  onClick={() => handleSave(problem.problem_id)}
                >
                  {saving[problem.problem_id] ? "Saving..." : "Save"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ProblemList;
