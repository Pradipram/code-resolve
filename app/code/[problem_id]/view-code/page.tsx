"use client";
import EmptyCode from "@/components/code/empty-code";
import CodeList from "@/components/code/code-list";
import PageLoader from "@/components/ui/PageLoader";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CodeInterface, CommonProblemInterface } from "@/data/types";

const Viewcode = () => {
  const { problem_id } = useParams();
  const [problem, setProblem] = useState<CommonProblemInterface | null>(null);
  const [codes, setCodes] = useState<CodeInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "add-code";

  useEffect(() => {
    if (!problem_id) {
      toast.error(
        "failed to open view code page. Please report this issue to github."
      );
      router.push("/dashboard");
      return;
    }
    const fetchProblem = async () => {
      setLoading(true);
      let response;
      if (from === "dashboard") {
        response = await fetch(`/api/problem/${problem_id}`);
      } else if (from === "topic") {
        response = await fetch(
          `/api/userProblemStatus/${problem_id}/get-details`
        );
      } else {
        toast.error("redirected from wrong page.");
        return;
      }
      if (!response.ok) {
        toast.error("Failed to fetch problem");
        setLoading(false);
        return;
      }
      const data = await response.json();
      console.log("Fetched problem data:", data);
      setProblem(data);
      setCodes(data.codes || []);
      setLoading(false);
      // console.log("Fetched problem:", data);
    };
    fetchProblem();
  }, [problem_id, router, from]);

  const onDelete = (codeId: string) => {
    setCodes((prev) => prev.filter((c) => c.code_id !== codeId));
  };

  if (loading) return <PageLoader text="Loading Code Details" />;
  if (!problem) return null;

  return (
    <div className="flex flex-col flex-grow w-full min-h-0">
      {codes?.length > 0 ? (
        <CodeList
          codes={codes}
          problem_id={problem_id as string | number}
          problem_name={problem.problem_name || ""}
          parent={from}
          onDelete={onDelete}
        />
      ) : (
        <EmptyCode
          problem_id={problem_id as string | number}
          problem_name={problem.problem_name || ""}
          parent={from}
        />
      )}
    </div>
  );
};

export default Viewcode;
