"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Shuffle, Filter } from "lucide-react";
import DSAProblemListData from "@/data/DSAProblemList.json";
import { toast } from "react-toastify";
import { PlatformIcon } from "@/components/platform-icons";
import { DSAProblemInterface } from "@/data/types";

// Local state for user problem statuses
type UserProblemStatus = {
  [problemId: string]: string;
};

const statusOptions = ["All", "Solved", "Unsolved", "Attempted"];

const DSATopicPage = () => {
  const params = useParams();
  const sheetId = typeof params.sheet_id === "string" ? params.sheet_id : "";
  const topicSlug = typeof params.topic === "string" ? params.topic : "";
  // Convert topicSlug back to display name
  const topicName = decodeURIComponent(topicSlug.replace(/-/g, " ")).replace(
    /\b\w/g,
    (c) => c.toUpperCase()
  );

  // Filter problems by sheet and topic
  const allProblems = useMemo(() => {
    return (DSAProblemListData.DSAProblemList || []).filter(
      (problem) =>
        problem.sheets &&
        problem.sheets.some(
          (s) => s.toLowerCase().replace(/\s+/g, "-") === sheetId.toLowerCase()
        ) &&
        problem.topics &&
        problem.topics.some(
          (t) =>
            t.toLowerCase().replace(/\s+/g, "-") === topicSlug.toLowerCase()
        )
    );
  }, [sheetId, topicSlug]);

  // State for filter
  const [statusFilter, setStatusFilter] = useState<string>("All");
  // State for user problem statuses
  const [userStatuses, setUserStatuses] = useState<UserProblemStatus>({});

  // Get status for a problem (pure function)
  const getUserProblemStatus = (problemId: string | number) => {
    return userStatuses[problemId] || "Unsolved";
  };

  React.useEffect(() => {
    if (!allProblems.length) return;
    const fetchStatuses = async () => {
      try {
        const ids = allProblems.map((p) => p.id).join(",");
        const res = await fetch(`/api/user-problem-status/${ids}`);
        const data = await res.json();
        console.log("Fetched user statuses:", data);
        if (data.statuses) {
          const statusMap: UserProblemStatus = {};
          data.statuses.forEach((s: { problem_id: string; status: string }) => {
            statusMap[s.problem_id] = s.status;
          });
          setUserStatuses(statusMap);
        }
      } catch {}
    };
    fetchStatuses();
  }, [allProblems]);

  // Filtered problems
  const filteredProblems = useMemo(() => {
    if (statusFilter === "All") return allProblems;
    return allProblems.filter((problem) => {
      const status = getUserProblemStatus(problem.id);
      return status.toLowerCase() === statusFilter.toLowerCase();
    });
  }, [allProblems, statusFilter, userStatuses]);

  // Update status in DB and local state
  const handleStatusChange = async (problemId: string, newStatus: string) => {
    setUserStatuses((prev) => ({ ...prev, [problemId]: newStatus })); // optimistic
    try {
      const res = await fetch("/api/user-problem-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem_id: problemId,
          status: newStatus,
        }),
      });
      // console.log("Response:", await res.json());
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status");
      }
      if (newStatus === "Unsolved") {
        setUserStatuses((prev) => {
          const copy = { ...prev };
          delete copy[problemId];
          return copy;
        });
      }
    } catch (e: any) {
      // revert on error
      setUserStatuses((prev) => ({
        ...prev,
        [problemId]: getUserProblemStatus(problemId),
      }));
      toast.warning(e.message);
    }
  };

  // Pick random problem from filtered list
  const handlePickRandom = () => {
    if (!filteredProblems.length) return;
    const randomIdx = Math.floor(Math.random() * filteredProblems.length);
    const problem = filteredProblems[randomIdx];
    if (problem.urls && problem.urls.length > 0) {
      window.open(problem.urls[0], "_blank");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col md:flex-row gap-8">
      {/* Main Table Section */}
      <div className="flex-1 max-w-5xl mx-auto px-4 py-12">
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{topicName}</span>
                <Badge variant="secondary" className="ml-2">
                  {filteredProblems.length} Problems
                </Badge>
              </div>
              <Button
                onClick={handlePickRandom}
                className="flex items-center gap-2 mt-2 sm:mt-0"
              >
                <Shuffle className="h-4 w-4" /> Pick Random
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-2 text-left">Problem</th>
                    <th className="px-4 py-2 text-left">Links</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Difficulty</th>
                    <th className="px-4 py-2 text-left">Company</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.length > 0 ? (
                    filteredProblems.map((problem: DSAProblemInterface) => (
                      <tr key={problem.id} className="border-t">
                        <td className="px-4 py-2">{problem.title}</td>
                        <td className="px-4 py-2">
                          {problem.urls && problem.urls.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {problem.urls.map((url: string, idx: number) => (
                                <a
                                  key={idx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block border rounded p-1 bg-white hover:bg-gray-100"
                                  title={url}
                                >
                                  <PlatformIcon url={url} />
                                </a>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <Select
                            value={getUserProblemStatus(problem.id)}
                            onValueChange={(val) =>
                              handleStatusChange(problem.id.toString(), val)
                            }
                          >
                            <SelectTrigger
                              className={
                                `w-32 ` +
                                (getUserProblemStatus(problem.id) === "Solved"
                                  ? "bg-green-200 text-green-800"
                                  : getUserProblemStatus(problem.id) ===
                                    "Attempted"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : "bg-red-200 text-red-800")
                              }
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Solved">Solved</SelectItem>
                              <SelectItem value="Attempted">
                                Attempted
                              </SelectItem>
                              <SelectItem value="Unsolved">Unsolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-2">
                          <Badge
                            className={
                              problem.difficulty === "easy"
                                ? "bg-green-100 text-green-700"
                                : problem.difficulty === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {problem.difficulty.charAt(0).toUpperCase() +
                              problem.difficulty.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-2">
                          {problem.company && problem.company.length > 0 ? (
                            problem.company.join(", ")
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center text-gray-500 py-8"
                      >
                        No problems found for this topic.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Filter Section */}
      <div className="w-full md:w-64 px-4 py-12 flex flex-col gap-6">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" /> Filter by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DSATopicPage;
