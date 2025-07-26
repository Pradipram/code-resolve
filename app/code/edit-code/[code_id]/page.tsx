"use client";
import { Button } from "@/components/ui/button";
import MonacoEditor from "@/components/ui/MonacoEditor";
import { CodeType } from "@/data/types";
import { useParams, useSearchParams } from "next/navigation";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditPage = () => {
  const { code_id } = useParams();
  const searchParms = useSearchParams();
  const problemName = searchParms.get("problem_name") || "";
  const [code, setCode] = useState<CodeType | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCodeDetails = async () => {
      if (!code_id) {
        return;
      }
      const res = await fetch(`/api/code/get-code/${code_id}`);
      if (!res.ok) {
        console.error("Failed to fetch code details");
        return;
      }
      const data = await res.json();
      setCode(data);
    };
    fetchCodeDetails();
  }, [code_id]);

  const handleSaveChanges = async () => {
    if (!code) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/code/edit-code/${code_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.code,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to save changes");
        setSaving(false);
        return;
      }
      const data = await res.json();
      setCode(data);
      toast.success("Code updated successfully!");
      setTimeout(() => {
        router.push(`/code/${code.problem_id}/view-code`);
      }, 1200);
    } catch (error: any) {
      toast.error(error?.message || "Error saving changes");
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-3xl rounded-xl border p-6 shadow bg-white dark:bg-gray-900 mx-auto my-6">
      <h2 className="text-lg font-bold mb-4 text-center">
        Edit code for your problem
        <span className="text-gray-500"> [{problemName}]</span>
      </h2>
      <h1 className="text-2xl font-bold mb-4 text-center">{code?.title}</h1>
      <div className="flex items-center justify-between mb-4">
        <span>your code editor</span>
        <span>{code?.language}</span>
      </div>
      <MonacoEditor
        value={code?.code || ""}
        language={code?.language || "cpp"}
        theme="vs-dark"
        height="400px"
        onChange={(value) => {
          setCode((prev: CodeType | null) =>
            prev ? { ...prev, code: value ?? "" } : prev
          );
        }}
      />
      <div className="w-full flex items-center justify-center m-4">
        <Button onClick={handleSaveChanges} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default EditPage;
