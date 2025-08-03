"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight, Shuffle } from "lucide-react";
import DSAProblemListData from "@/data/DSAProblemList.json";
import { dsaSheets } from "@/data/ui/practice-dsa";

const getSheetMeta = (sheetId: string) => {
  return dsaSheets.find(
    (sheet) => sheet.id.toLowerCase() === sheetId.toLowerCase()
  );
};

const getSheetProblems = (sheetId: string) => {
  return DSAProblemListData.DSAProblemList.filter(
    (problem) =>
      problem.sheets &&
      problem.sheets.some(
        (s) => s.toLowerCase().replace(/\s+/g, "-") === sheetId.toLowerCase()
      )
  );
};

const getSheetTopics = (problems: any[]) => {
  const topicSet = new Set<string>();
  problems.forEach((problem: any) => {
    if (problem.topics) {
      (problem.topics as string[]).forEach((topic: string) =>
        topicSet.add(topic)
      );
    }
  });
  return Array.from(topicSet);
};

const DSASheetPage = () => {
  const params = useParams();
  const router = useRouter();
  const sheetId = typeof params.sheet_id === "string" ? params.sheet_id : "";

  const sheetMeta = useMemo(() => getSheetMeta(sheetId), [sheetId]);
  const sheetProblems = useMemo(() => getSheetProblems(sheetId), [sheetId]);
  const sheetTopics = useMemo(
    () => getSheetTopics(sheetProblems),
    [sheetProblems]
  );

  const handlePickRandom = () => {
    if (!sheetProblems.length) return;
    const randomIdx = Math.floor(Math.random() * sheetProblems.length);
    const problem = sheetProblems[randomIdx];
    if (problem.urls && problem.urls.length > 0) {
      window.open(problem.urls[0], "_blank");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              {sheetMeta ? sheetMeta.name : sheetId}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {sheetMeta ? sheetMeta.description : "No description available."}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="text-xs">
                Problems: {sheetProblems.length}
              </Badge>
              {sheetMeta && (
                <Badge variant="secondary" className="text-xs">
                  Difficulty: {sheetMeta.difficulty}
                </Badge>
              )}
              {sheetMeta && (
                <Badge variant="secondary" className="text-xs">
                  Estimated Time: {sheetMeta.estimatedTime}
                </Badge>
              )}
            </div>
            <Button
              onClick={handlePickRandom}
              className="flex items-center gap-2"
            >
              <Shuffle className="h-4 w-4" /> Pick Random Question
            </Button>
          </CardContent>
        </Card>

        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Topics in this Sheet
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sheetTopics.length > 0 ? (
            (sheetTopics as string[]).map((topic: string, idx: number) => {
              // Make topic URL-safe
              const topicSlug = encodeURIComponent(
                topic.replace(/\s+/g, "-").toLowerCase()
              );
              return (
                <a
                  key={idx}
                  href={`/practice/dsa/${sheetId}/${topicSlug}`}
                  className="block"
                >
                  <Card className="cursor-pointer bg-white dark:bg-gray-800 border-0 shadow-md hover:shadow-xl transition-shadow hover:ring-2 hover:ring-blue-400">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-600 dark:text-blue-400 flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" /> {topic}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Practice all problems related to{" "}
                        <span className="font-semibold">{topic}</span> in this
                        sheet.
                      </p>
                    </CardContent>
                  </Card>
                </a>
              );
            })
          ) : (
            <p className="text-gray-500">No topics found for this sheet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DSASheetPage;
