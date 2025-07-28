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
import { MessageSquare, SquareCode } from "lucide-react";
import { ProblemInterface } from "@/data/types";
import DialogLoader from "../ui/DialogLoader";

interface ProblemListProps {
  problems: ProblemInterface[];
  onDelete: (problemId: number) => void;
  onStatusChange: (problemId: number, status: string) => void;
}

const statusOptions = ["Unsolved", "Attempted", "Solved"];

function getStatusBgClass(status: string) {
  switch (status.toLowerCase()) {
    case "solved":
      return "bg-green-200 dark:bg-green-700";
    case "attempted":
      return "bg-yellow-200 dark:bg-yellow-700";
    case "unsolved":
      return "bg-red-200 dark:bg-red-700";
    default:
      return "bg-gray-100 dark:bg-gray-900";
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  onDelete,
  onStatusChange,
}) => {
  // Remove localProblems state, use problems prop directly

  const [noteModal, setNoteModal] = useState<{
    open: boolean;
    problem: ProblemInterface | null;
    note: string;
    saving: boolean;
    editing: boolean;
  }>({ open: false, problem: null, note: "", saving: false, editing: false });
  const [isStatusChanging, setIsStatusChanging] = useState(false);

  // Update status in DB immediately on change
  const handleStatusChange = async (problemId: number, newStatus: string) => {
    try {
      setIsStatusChanging(true);
      const res = await fetch("/api/problem", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem_id: problemId, status: newStatus }),
      });
      const result = await res.json();
      if (res.ok) {
        // No local state update, rely on parent to update problems prop
        if (onStatusChange) onStatusChange(problemId, newStatus);
      } else {
        toast.error(
          result.error || res.statusText || "Failed to update status"
        );
      }
    } catch (err) {
      toast.error("Error updating status");
    } finally {
      setIsStatusChanging(false);
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
        // No local state update, rely on parent to update problems prop
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
      <DialogLoader text="Changing Status" open={isStatusChanging} />
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
                  value={problem.status}
                  onChange={(e) =>
                    handleStatusChange(problem.problem_id, e.target.value)
                  }
                  className={`border rounded px-2 py-1 text-black dark:text-white ${getStatusBgClass(
                    problem.status
                  )}`}
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
