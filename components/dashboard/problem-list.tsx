import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import DeleteAlertDialog from "./delete-alert-dialog";
import { toast } from "react-toastify";
import { Code, MessageSquare, SquareCode } from "lucide-react";
import { ProblemInterface } from "@/data/types";

interface ProblemListProps {
  problems: ProblemInterface[];
  onDelete?: (problemId: number) => void;
}

const statusOptions = ["Unsolved", "Attempted", "Solved"];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

const ProblemList: React.FC<ProblemListProps> = ({ problems, onDelete }) => {
  const [saving, setSaving] = useState<{ [key: number]: boolean }>({});
  const [localProblems, setLocalProblems] =
    useState<ProblemInterface[]>(problems);

  // Note modal state
  const router = useRouter();
  const [noteModal, setNoteModal] = useState<{
    open: boolean;
    problem: ProblemInterface | null;
    note: string;
    saving: boolean;
    editing: boolean;
  }>({ open: false, problem: null, note: "", saving: false, editing: false });

  // Update status in DB immediately on change
  const handleStatusChange = async (problemId: number, newStatus: string) => {
    setSaving((prev) => ({ ...prev, [problemId]: true }));
    try {
      const res = await fetch("/api/problem", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem_id: problemId, status: newStatus }),
      });
      const result = await res.json();
      if (res.ok) {
        setLocalProblems((prev) =>
          prev.map((p) =>
            p.problem_id === problemId
              ? {
                  ...p,
                  status: newStatus,
                  updated_at: new Date().toISOString(),
                }
              : p
          )
        );
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

  // Open note modal
  const handleOpenNote = (problem: ProblemInterface) => {
    setNoteModal({
      open: true,
      problem,
      note: problem.note || "",
      saving: false,
      editing: false,
    });
  };

  // Save note
  const handleSaveNote = async () => {
    if (!noteModal.problem) return;
    setNoteModal((prev) => ({ ...prev, saving: true }));
    try {
      const res = await fetch("/api/problem", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem_id: noteModal.problem.problem_id,
          note: noteModal.note,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Note updated successfully");
        // Update the local problems list with the new note and updated_at
        setLocalProblems((prev) => {
          return prev
            .map((p) =>
              p.problem_id === noteModal.problem!.problem_id
                ? {
                    ...p,
                    note: noteModal.note,
                    updated_at: new Date().toISOString(),
                  }
                : p
            )
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            );
        });
        setNoteModal((prev) => ({
          ...prev,
          open: false,
          saving: false,
          editing: false,
        }));
      } else {
        toast.error(result.error || res.statusText || "Failed to update note");
        setNoteModal((prev) => ({ ...prev, saving: false }));
      }
    } catch (err) {
      toast.error("Error updating note");
      setNoteModal((prev) => ({ ...prev, saving: false }));
    }
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
          {localProblems.map((problem) => (
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
                  value={problem.status}
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
                {/* Code icon: yellow if at least one code exists and is non-empty, white if not, with instant custom tooltip */}
                <a href={`/code/${problem.problem_id}/view-code`}>
                  <span className="inline-block relative group cursor-pointer">
                    <SquareCode
                      color={
                        problem.codeCount && problem.codeCount > 0
                          ? "#facc15"
                          : "white"
                      }
                    />
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-75 whitespace-nowrap z-10">
                      View Code
                    </span>
                  </span>
                </a>
              </td>
              <td className="px-4 py-2 text-center">
                {/* Note icon: white if no note, yellow if note exists, with instant custom tooltip */}
                <span
                  className="inline-block relative group cursor-pointer"
                  onClick={() => handleOpenNote(problem)}
                >
                  <MessageSquare
                    color={
                      problem.note && problem.note.trim() ? "#facc15" : "white"
                    }
                    fill={
                      problem.note && problem.note.trim() ? "#facc15" : "none"
                    }
                  />
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-75 whitespace-nowrap z-10">
                    {problem.note && problem.note.trim()
                      ? "View/Edit Note"
                      : "Add Note"}
                  </span>
                </span>
              </td>
              <td className="px-4 py-2">{formatDate(problem.created_at)}</td>
              <td className="px-4 py-2">{formatDate(problem.updated_at)}</td>
              <td className="px-4 py-2 flex gap-2">
                <DeleteAlertDialog
                  problemId={problem.problem_id}
                  onDelete={handleDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Note Modal */}
      <Dialog
        open={noteModal.open}
        onOpenChange={(open: boolean) =>
          setNoteModal((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Note for: {noteModal.problem?.problem_name}
            </DialogTitle>
          </DialogHeader>
          <div className="my-2">
            {noteModal.problem?.note &&
            noteModal.problem.note.trim() &&
            !noteModal.editing ? (
              <>
                <div className="mb-2 text-gray-700 dark:text-gray-300">
                  {noteModal.problem.note}
                </div>
                <DialogFooter>
                  <Button
                    onClick={() =>
                      setNoteModal((prev) => ({ ...prev, editing: true }))
                    }
                    className="m-auto"
                  >
                    Edit
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <div className="mb-2 text-gray-700 dark:text-gray-300">
                  {noteModal.problem?.note && noteModal.problem.note.trim()
                    ? "Edit your note below:"
                    : "No note exists. Write a note below:"}
                </div>
                <Textarea
                  value={noteModal.note}
                  onChange={(e) =>
                    setNoteModal((prev) => ({ ...prev, note: e.target.value }))
                  }
                  rows={5}
                  className="w-full"
                />
                <DialogFooter>
                  <Button
                    onClick={handleSaveNote}
                    disabled={noteModal.saving}
                    className="mx-auto mt-2"
                  >
                    {noteModal.saving ? "Saving..." : "Save Note"}
                  </Button>
                </DialogFooter>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ProblemList;
