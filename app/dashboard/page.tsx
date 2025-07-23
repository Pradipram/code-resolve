"use client";

import EmptyDashboard from "@/components/dashboard/empty-dashboard";
import ProblemList from "@/components/dashboard/problem-list";
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
    <div className="flex items-center justify-center w-full h-full min-w-screen">
      {problems && problems.length > 0 ? (
        <ProblemList problems={problems} onDelete={handleDelete} />
      ) : (
        <EmptyDashboard />
      )}
    </div>
  );
};

export default Dashboard;
