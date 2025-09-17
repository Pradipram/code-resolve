"use client";

import EmptyDashboard from "@/components/dashboard/empty-dashboard";
import Link from "next/link";
import SearchInput from "@/components/dashboard/search-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import PageLoader from "@/components/ui/PageLoader";
import { ProblemInterface } from "@/data/types";
import { filterProblemsFeild } from "@/data/ui/dashboard";
import GenerateProblemListGui from "@/lib/generateProblemListGui";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [problems, setProblems] = useState<ProblemInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  // Track checked filters by id
  const [checkedFilters, setCheckedFilters] = useState<string[]>(
    filterProblemsFeild.filter((f) => f.checked).map((f) => f.id)
  );

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch("/api/problem", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          setProblems(data);
          console.log("Fetched problems:", data);
        }
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  if (loading) {
    return <PageLoader text="Loading Dashboard" />;
  }

  // Handle delete action locally for instant UI update
  const handleDelete = (problemId: number) => {
    setProblems((prev) => prev.filter((p) => p.problem_id !== problemId));
  };

  const handleStatusChange = (problemId: number, status: string) => {
    setProblems((prev: ProblemInterface[]) =>
      prev.map((p: ProblemInterface) =>
        p.problem_id === problemId ? { ...p, status } : p
      )
    );
  };

  const handleNoteChange = (problemId: number, note: string) => {
    setProblems((prev: ProblemInterface[]) =>
      prev.map((p: ProblemInterface) =>
        p.problem_id === problemId ? { ...p, note } : p
      )
    );
  };

  // Filtering logic
  const s = search.trim().toLowerCase();
  let filteredProblems = problems;
  // 1. Filter by search (problem name only)
  if (s) {
    filteredProblems = filteredProblems.filter(
      (p) => p.problem_name && p.problem_name.toLowerCase().includes(s)
    );
  }
  // 2. Filter by checked checkboxes
  if (checkedFilters.length > 0) {
    filteredProblems = filteredProblems.filter((p) => {
      // Platform filters
      const platformFilters = [
        "codeforces",
        "leetcode",
        "codestudio",
        "geeksforgeeks",
      ];
      const levelFilters = ["easy", "medium", "hard"];
      const statusFilters = ["unsolved", "attempted", "solved"];
      const ageFilters = ["1 month older", "3 month older"];
      let match = true;
      // Platform
      if (checkedFilters.some((f) => platformFilters.includes(f))) {
        match =
          match && checkedFilters.some((f) => p.platform?.toLowerCase() === f);
      }
      // Level
      if (checkedFilters.some((f) => levelFilters.includes(f))) {
        match =
          match && checkedFilters.some((f) => p.level?.toLowerCase() === f);
      }
      // Status
      if (checkedFilters.some((f) => statusFilters.includes(f))) {
        match =
          match && checkedFilters.some((f) => p.status?.toLowerCase() === f);
      }
      // Age
      if (checkedFilters.some((f) => ageFilters.includes(f))) {
        const now = new Date();
        if (checkedFilters.includes("1 month older")) {
          const updated = new Date(p.updated_at);
          const oneMonthAgo = new Date(now);
          oneMonthAgo.setMonth(now.getMonth() - 1);
          match = match && updated < oneMonthAgo;
        }
        if (checkedFilters.includes("3 month older")) {
          const updated = new Date(p.updated_at);
          const threeMonthAgo = new Date(now);
          threeMonthAgo.setMonth(now.getMonth() - 3);
          match = match && updated < threeMonthAgo;
        }
      }
      return match;
    });
  }

  return (
    <div className="flex flex-2 h-full">
      {problems && problems.length > 0 ? (
        <div className="flex flex-row p-4 gap-4 w-full">
          {/* Code for problemslist on the left side of the dashboard */}
          <div className="flex-1">
            <h1 className="text-center">Your saved problems</h1>
            {/* <ProblemList
              problems={filteredProblems}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            /> */}
            <GenerateProblemListGui
              problemList={filteredProblems}
              fromPage="dashboard"
              onStatusChange={handleStatusChange}
              onNoteChange={handleNoteChange}
              onDelete={handleDelete}
            />
          </div>
          {/* Code for filter and search on the right side of the dashboard */}
          <div className="w-[350px] min-w-[300px] max-w-[400px] border-l border-gray-200 dark:border-white px-6 flex flex-col gap-2 items-center justify-center">
            <SearchInput value={search} onChange={setSearch} />
            <div className="w-full justify-center items-center p-2 gap-2 border rounded ">
              <h4 className="text-center">Filter Problems</h4>
              <div className="flex justify-center w-full">
                <div className="w-[200px] bg-gray-100 dark:bg-transparent p-2">
                  {filterProblemsFeild.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-start gap-2 justify-start text-gray-600 dark:text-gray-400 m-2"
                    >
                      <Checkbox
                        id={field.id}
                        checked={checkedFilters.includes(field.id)}
                        onCheckedChange={(checked) => {
                          setCheckedFilters((prev) => {
                            if (checked) {
                              return [...prev, field.id];
                            } else {
                              return prev.filter((f) => f !== field.id);
                            }
                          });
                        }}
                      />
                      <Label htmlFor={field.id}>{field.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/add-problem">
              <Button>Add New Problem</Button>
            </Link>
            <Link href="/practice/dsa">
              <Button variant={"outline"}>Practice DSA</Button>
            </Link>
            <Link href="/practice/cp">
              <Button variant={"outline"}>Practice CP</Button>
            </Link>
          </div>
        </div>
      ) : (
        <EmptyDashboard />
      )}
    </div>
  );
};

export default Dashboard;
