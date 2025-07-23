import React, { useState } from "react";
import MonacoEditor from "@/components/ui/MonacoEditor";
import { Button } from "@/components/ui/button";

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
}

const statusOptions = ["Unsolved", "Attempted", "Solved"];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

const ProblemList: React.FC<ProblemListProps> = ({ problems }) => {
  const [editedStatus, setEditedStatus] = useState<{ [key: number]: string }>(
    {}
  );
  const [saveEnabled, setSaveEnabled] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handleStatusChange = (problemId: number, newStatus: string) => {
    setEditedStatus((prev) => ({ ...prev, [problemId]: newStatus }));
    setSaveEnabled((prev) => ({ ...prev, [problemId]: true }));
  };

  const handleSave = (problemId: number) => {
    // TODO: Implement save logic (API call)
    setSaveEnabled((prev) => ({ ...prev, [problemId]: false }));
  };

  const handleDelete = (problemId: number) => {
    // TODO: Implement delete logic (API call)
  };

  return (
    <div className="overflow-x-auto mt-4">
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
              <td className="px-4 py-2 min-w-[200px]">
                <MonacoEditor
                  value={problem.code || ""}
                  language={problem.language || "javascript"}
                  height="100"
                  options={{ readOnly: true }}
                />
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
                    strokeWidth="2"
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
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(problem.problem_id)}
                >
                  Delete
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  disabled={!saveEnabled[problem.problem_id]}
                  onClick={() => handleSave(problem.problem_id)}
                >
                  Save
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
