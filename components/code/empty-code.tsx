import { FileQuestion } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface EmptyCodeProps {
  problem_id: string | number;
  problem_name: string;
  parent: string;
}

const EmptyCode: React.FC<EmptyCodeProps> = ({
  problem_id,
  problem_name,
  parent,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16">
      <FileQuestion size={64} className="mb-6 text-gray-400" />
      <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">
        No code added yet
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
        You haven't added any code for this problem .
        <br />
        <span className="font-semibold">
          [{problem_id}] {problem_name}
        </span>
        <br />
        Click "Add Code" to get started!
      </p>
      <a
        href={`/code/${problem_id}/add-code/?from=view-code&problem_name=${problem_name}&parent=${parent}`}
      >
        <Button variant={"link"}>Add Code</Button>
      </a>
    </div>
  );
};

export default EmptyCode;
