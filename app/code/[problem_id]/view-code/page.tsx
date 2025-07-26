"use client";
import EmptyCode from "@/components/code/empty-code";
import { Problem } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const page = () => {
  const { problem_id } = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const router = useRouter();

  if (!problem_id) {
    toast.error(
      "failed to open view code page. Please report this issue to github."
    );
    router.push("/dashboard");
  }

  useEffect(() => {
    const fetchProblem = async () => {
      if (!problem_id) return;
      const response = await fetch(`/api/problem/${problem_id}`);
      if (!response.ok) {
        toast.error("Failed to fetch problem");
        return;
      }
      const data = await response.json();
      setProblem(data);
    };
    fetchProblem();
  }, [problem_id]);

  return (
    <div className="m-auto">
      <EmptyCode
        problem_id={problem_id as string | number}
        problem_name={problem?.problem_name || ""}
      />
    </div>
  );
};

export default page;
