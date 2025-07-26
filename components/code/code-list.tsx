import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface CodeListProps {
  codes: Array<any>;
  problem_id: string | number;
  problem_name: string;
}

const CodeList: React.FC<CodeListProps> = ({
  codes,
  problem_id,
  problem_name,
}) => {
  const router = useRouter();

  const handleDelete = async (codeId: string) => {
    if (!confirm("Are you sure you want to delete this code?")) return;
    try {
      const res = await fetch(`/api/code/${problem_id}/delete-code/${codeId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err?.error || "Failed to delete code");
        return;
      }
      toast.success("Code deleted successfully");
      router.refresh();
    } catch (err) {
      toast.error("Failed to delete code");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto m-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-center w-full">
          Code List for <span className="text-gray-500">[{problem_name}]</span>
        </h2>
        <a
          href={`/code/${problem_id}/add-code?from=view-code&problem_name=${encodeURIComponent(
            problem_name
          )}`}
        >
          <Button
            variant="outline"
            size="icon"
            className="ml-2"
            title="Add Code"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </a>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700 flex flex-col gap-6">
        {codes.map((code: any) => (
          <li
            key={code.code_id}
            className="py-4 px-2 flex flex-col gap-1 relative border rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">{code.title}</span>
              <span className="text-xs bg-gray-200 dark:bg-gray-700 rounded px-2 py-1 ml-2">
                {code.language}
              </span>
            </div>
            <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-xs overflow-x-auto max-h-100">
              {code.code}
            </pre>
            {code.note && (
              <div className="text-xs text-gray-500 mt-1">
                Note: {code.note}
              </div>
            )}
            <div className="text-xs text-gray-400 mt-1">
              Created: {new Date(code.created_at).toLocaleString()}
            </div>
            {/* Edit and Delete icons at bottom right */}
            <div className="absolute right-2 bottom-2 flex gap-2">
              <a href={`/code/${problem_id}/edit-code/${code.code_id}`}>
                <Button variant="ghost" size="icon" title="Edit Code">
                  <Edit className="w-4 h-4" />
                </Button>
              </a>
              <Button
                variant="ghost"
                size="icon"
                title="Delete Code"
                onClick={() => handleDelete(code.code_id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CodeList;
