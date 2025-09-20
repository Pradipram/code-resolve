import React from "react";
import { Button } from "@/components/ui/button";

const EmptyDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 min-h-[400px] w-[600px]">
      <div className="flex flex-col items-center max-w-md text-center space-y-6">
        <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-600 dark:text-blue-400"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 14.25v-4.5L12 12l3-2.25v4.5" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          No problems saved yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          You haven&apos;t saved any coding problems yet. Start practicing DSA
          or competitive programming problems to build your collection.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="/practice/dsa">
            <Button variant="default">Browse DSA Problems</Button>
          </a>
          <a href="/practice/cp">
            <Button variant="outline">Try Competitive Programming</Button>
          </a>
        </div>
        <span>--OR--</span>
        <div>
          <a href="/add-problem">
            <Button variant="ghost">Add a problem</Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmptyDashboard;
