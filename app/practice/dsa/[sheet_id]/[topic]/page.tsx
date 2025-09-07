"use client";

import GenerateProblemListGui from "@/lib/generateProblemListGui";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import DSAProblemListData from "@/data/DSAProblemList.json";
import { DSAProblemInterface } from "@/data/types";

export function getProblemsBySheetAndTopic(sheetId: string, topic: string) {
  return (DSAProblemListData.DSAProblemList || []).filter(
    (problem) =>
      problem.sheets &&
      problem.sheets.some(
        (s) => s.toLowerCase().replace(/\s+/g, "-") === sheetId.toLowerCase()
      ) &&
      problem.topics &&
      problem.topics.some(
        (t) => t.toLowerCase().replace(/\s+/g, "-") === topic.toLowerCase()
      )
  );
}

const page = () => {
  const [dsaProblemList, setDsaProblemList] = useState<DSAProblemInterface[]>(
    []
  );
  const params = useParams();
  const { sheet_id, topic } = params as { sheet_id?: string; topic?: string };
  useEffect(() => {
    if (sheet_id && topic) {
      const problems = getProblemsBySheetAndTopic(sheet_id, topic);
      const mappedProblems: DSAProblemInterface[] = problems.map((problem) => ({
        problem_id: problem.id,
        problem_name: problem.title,
        urls: problem.urls,
        level: problem.difficulty,
        topics: problem.topics,
        sheets: problem.sheets,
        companies: problem.company,
        status: "Unsolved",
        code: [],
        codeCount: 0,
      }));
      setDsaProblemList(mappedProblems);
    }
  }, [sheet_id, topic]);

  const handleStatusChange = (problemId: number, status: string) => {
    setDsaProblemList((prev: DSAProblemInterface[]) =>
      prev.map((p: DSAProblemInterface) =>
        p.problem_id === problemId ? { ...p, status } : p
      )
    );
  };

  const handleNoteChange = (problemId: number, note: string) => {
    setDsaProblemList((prev: DSAProblemInterface[]) =>
      prev.map((p: DSAProblemInterface) =>
        p.problem_id === problemId ? { ...p, note } : p
      )
    );
  };

  return (
    <div className="m-auto">
      <GenerateProblemListGui
        problemList={dsaProblemList}
        fromPage="topic"
        onStatusChange={handleStatusChange}
        onNoteChange={handleNoteChange}
      />
    </div>
  );
};

export default page;
