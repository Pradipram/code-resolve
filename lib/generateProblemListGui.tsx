import DeleteAlertDialog from "@/components/dashboard/delete-alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DialogLoader from "@/components/ui/DialogLoader";
import { Textarea } from "@/components/ui/textarea";
import { CommonProblemInterface, statusOptions } from "@/data/types";
import { MessageSquare, SquareCode } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { FC, useState } from "react";
import { toast } from "react-toastify";

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

interface GenerateProblemListGuiProps {
  problemList: CommonProblemInterface[];
  fromPage: string;
  onDelete?: (problemId: number) => void;
  onStatusChange: (problemId: number, status: string) => void;
  onNoteChange: (problemId: number, note: string) => void;
}

const GenerateProblemListGui: FC<GenerateProblemListGuiProps> = ({
  problemList,
  fromPage,
  onStatusChange,
  onDelete,
  onNoteChange,
}) => {
  const [isStatusChanging, setIsStatusChanging] = useState(false);
  const [noteModal, setNoteModal] = useState<{
    open: boolean;
    problem: CommonProblemInterface | null;
    note: string;
    saving: boolean;
    editing: boolean;
  }>({ open: false, problem: null, note: "", saving: false, editing: false });
  const pathname = usePathname();

  const handleStatusChange = async (problemId: number, newStatus: string) => {
    setIsStatusChanging(true);
    try {
      let res;
      if (fromPage === "dashboard") {
        res = await fetch("/api/problem", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ problem_id: problemId, status: newStatus }),
        });
      }
      if (fromPage === "topic") {
        res = await fetch(`/api/userProblemStatus/${problemId}/update-status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });
      }
      if (!res) throw new Error("No response from server");
      const result = await res.json();
      if (res.ok) {
        if (onStatusChange) onStatusChange(problemId, newStatus);
      } else {
        toast.error(
          result.error || res.statusText || "Failed to update status"
        );
      }
    } catch (error) {
      toast.error("Error updating status");
    } finally {
      setIsStatusChanging(false);
    }
  };

  const handleOpenNote = (problem: CommonProblemInterface) => {
    setNoteModal({
      open: true,
      problem,
      note: problem.note || "",
      saving: false,
      editing: false,
    });
  };
  const handleDelete = (problemId: number) => {
    if (onDelete) onDelete(problemId);
  };

  // Save note
  const handleSaveNote = async () => {
    if (!noteModal.problem) return;
    setNoteModal((prev) => ({ ...prev, saving: true }));
    try {
      let res;
      if (pathname.includes("/dashboard")) {
        res = await fetch("/api/problem", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            problem_id: noteModal.problem.problem_id,
            note: noteModal.note,
          }),
        });
      } else if (pathname.includes("/dsa/")) {
        res = await fetch(
          `/api/userProblemStatus/${noteModal.problem.problem_id}/update-details`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              note: noteModal.note,
            }),
          }
        );
      } else {
        toast.error(
          "Failed to update note. Please report this issue to github."
        );
        setNoteModal((prev) => ({ ...prev, saving: false }));
        return;
      }
      const result = await res.json();
      if (res.ok) {
        toast.success("Note updated successfully");
        setNoteModal((prev) => ({
          ...prev,
          open: false,
          saving: false,
          editing: false,
        }));
        if (onNoteChange)
          onNoteChange(noteModal.problem.problem_id, noteModal.note);
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
    <div className="overflow-x-auto m-4 ">
      <DialogLoader text="Changing Status" open={isStatusChanging} />
      <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Note</th>
            {fromPage === "dashboard" && (
              <>
                <th className="px-4 py-2">Platform</th>
                <th className="px-4 py-2">Level</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Updated At</th>
                <th className="px-4 py-2">Action</th>
              </>
            )}
            {fromPage === "topic" && (
              <>
                <th className="px-4 py-2">Links</th>
                <th className="px-4 py-2">Companies</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {problemList &&
            problemList.map((problem) => (
              <tr key={problem.problem_id} className="border-t">
                <td className="px-4 py-2">
                  {fromPage === "dashboard" ? (
                    <a
                      href={problem.problem_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {problem.problem_name}
                    </a>
                  ) : (
                    <span>{problem.problem_name}</span>
                  )}
                </td>
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
                  <a
                    href={`/code/${problem.problem_id}/view-code?from=${fromPage}`}
                  >
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
                        problem.note && problem.note.trim()
                          ? "#facc15"
                          : "white"
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
                {fromPage === "dashboard" && (
                  <>
                    <td className="px-4 py-2">{problem.platform}</td>
                    <td className="px-4 py-2">{problem.level}</td>
                    <td className="px-4 py-2">
                      {formatDate(problem.created_at || "")}
                    </td>
                    <td className="px-4 py-2">
                      {formatDate(problem.updated_at || "")}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <DeleteAlertDialog
                        problemId={problem.problem_id}
                        onDelete={handleDelete}
                      />
                    </td>
                  </>
                )}
                {fromPage === "topic" && (
                  <>
                    <td className="px-4 py-2">
                      {problem.urls && problem.urls.length > 0 ? (
                        <ul className="list-disc pl-4">
                          {problem.urls.map((url, idx) => (
                            <li key={idx}>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {url}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span>No Links</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {problem.companies && problem.companies.length > 0 ? (
                        <ul className="list-disc pl-4">
                          {problem.companies.map((company, idx) => (
                            <li key={idx}>{company}</li>
                          ))}
                        </ul>
                      ) : (
                        <span>No Companies</span>
                      )}
                    </td>
                  </>
                )}
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

export default GenerateProblemListGui;
