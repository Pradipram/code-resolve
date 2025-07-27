"use client";

import EmptyDashboard from "@/components/dashboard/empty-dashboard";
import ProblemList from "@/components/dashboard/problem-list";
import SearchInput from "@/components/dashboard/search-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { filterProblemsFeild } from "@/data/ui/dashboard";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch("/api/problem", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          setProblems(data);
          console.log("Fetched problems:", data);
        }
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleDelete = (problemId: number) => {
    setProblems((prev) => prev.filter((p: any) => p.problem_id !== problemId));
  };

  return (
    <div className="flex w-full h-full min-w-screen">
      <div className="flex-1">
        {problems && problems.length > 0 ? (
          <div className="flex flex-row p-4 gap-4 w-full">
            <div className="flex-1">
              <h1 className="text-center">Your saved problems</h1>
              <ProblemList problems={problems} onDelete={handleDelete} />
            </div>
            <div className="w-[350px] min-w-[300px] max-w-[400px] border-l border-gray-200 dark:border-white px-6 flex flex-col gap-2 items-center justify-center">
              <SearchInput />
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
                          defaultChecked={field.checked}
                        />
                        <Label htmlFor={field.id}>{field.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <a href="/add-problem">
                <Button>Add New Problem</Button>
              </a>
              <a href="/dsa">
                <Button variant={"outline"}>Practice DSA</Button>
              </a>
              <a href="/cp">
                <Button variant={"outline"}>Practice CP</Button>
              </a>
            </div>
          </div>
        ) : (
          <EmptyDashboard />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
