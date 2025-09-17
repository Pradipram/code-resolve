import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface DeleteAlertDialogProps {
  problemId: number;
  onDelete: (problemId: number) => void;
}

const DeleteAlertDialog: React.FC<DeleteAlertDialogProps> = ({
  problemId,
  onDelete,
}) => {
  const handleDelete = async (problemId: number) => {
    try {
      const res = await fetch(`/api/problem`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ problem_id: problemId }),
      });
      const errorData = await res.json();
      if (res.ok) {
        toast.success("Problem deleted successfully");
        if (onDelete) onDelete(problemId);
      } else {
        toast.error(
          errorData.error || res.statusText || "Failed to delete problem"
        );
      }
    } catch {
      toast.error("Error deleting problem");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-red-100 hover:bg-red-500 text-red-800 border border-red-300 hover:text-white  ">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            problem from your account and remove it from the list and server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(problemId)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteAlertDialog;
