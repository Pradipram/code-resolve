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
    const fetchProblems = async () => {
      if (!sheet_id || !topic) return;

      // 1. Get static problems from JSON
      const problems = getProblemsBySheetAndTopic(sheet_id, topic);
      // console.log("Static Problems:", problems);

      // 2. Fetch user-specific problem status
      let userData: any[] = [];
      try {
        const res = await fetch(
          "/api/userProblemStatus/get-user-saved-problem"
        );
        if (res.ok) {
          userData = await res.json();
        } else {
          console.error("Failed to fetch user problem data");
        }
      } catch (err) {
        console.error("Error fetching user problems:", err);
      }
      // console.log("User Data:", userData);

      // 3. Merge JSON problems with user-specific data
      const mappedProblems: DSAProblemInterface[] = problems.map((problem) => {
        const userProblem = userData.find(
          (up) => Number(up.problem_id) === problem.id
        );

        return {
          problem_id: problem.id,
          problem_name: problem.title,
          urls: problem.urls,
          level: problem.difficulty,
          topics: problem.topics,
          sheets: problem.sheets,
          companies: problem.company,
          status: userProblem?.status || "Unsolved",
          note: userProblem?.note || "",
          codeCount: userProblem?.codeCount || 0,
        };
      });

      // 4. Update state
      setDsaProblemList(mappedProblems);
    };

    fetchProblems();
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
