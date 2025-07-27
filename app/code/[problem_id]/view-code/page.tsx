"use client";
import EmptyCode from "@/components/code/empty-code";
import CodeList from "@/components/code/code-list";
import PageLoader from "@/components/ui/PageLoader";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const page = () => {
  const { problem_id } = useParams();
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      const response = await fetch(`/api/problem/${problem_id}`);
      if (!response.ok) {
        toast.error("Failed to fetch problem");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setProblem(data);
      setLoading(false);
      // console.log("Fetched problem:", data);
    };
    fetchProblem();
  }, [problem_id, router]);

  if (loading) return <PageLoader page="Code Details" />;
  if (!problem) return null;

  const hasCodes = Array.isArray(problem.codes) && problem.codes.length > 0;

  // Sort codes by updated_at descending
  const sortedCodes = hasCodes
    ? [...problem.codes].sort((a: any, b: any) => {
        const aDate = new Date(a.updated_at).getTime();
        const bDate = new Date(b.updated_at).getTime();
        return bDate - aDate;
      })
    : [];

  return (
    <div className="flex flex-col flex-grow w-full min-h-0">
      {hasCodes ? (
        <CodeList
          codes={sortedCodes}
          problem_id={problem_id as string | number}
          problem_name={problem.problem_name || ""}
        />
      ) : (
        <EmptyCode
          problem_id={problem_id as string | number}
          problem_name={problem.problem_name || ""}
        />
      )}
    </div>
  );
};

export default page;
