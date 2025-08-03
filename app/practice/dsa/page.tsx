"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Clock, Star, ArrowRight, Code2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { dsaSheets, motivationalStats } from "@/data/ui/practice-dsa";

const DSAPracticePage = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Code2 className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Master Data Structures & Algorithms
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Transform your coding skills, ace technical interviews, and build
              the foundation for a successful tech career
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                <Users className="h-4 w-4 mr-1" />
                10M+ Developers Learning
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                <Star className="h-4 w-4 mr-1" />
                Proven Success Rate
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                <Clock className="h-4 w-4 mr-1" />
                Self-Paced Learning
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why DSA Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Why Master DSA?
          </h2>
          <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Data Structures and Algorithms form the backbone of computer science
            and software engineering. Here's why they're essential for your
            growth:
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {motivationalStats.map((stat, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-2">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{stat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* DSA Sheets Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Choose Your Learning Path
          </h2>
          <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Start your DSA journey with these carefully curated problem sheets.
            Each sheet is designed to take you from beginner to expert level.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dsaSheets.map((sheet) => (
              <Card
                key={sheet.id}
                className="relative group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 overflow-hidden bg-white dark:bg-gray-800"
              >
                {sheet.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}

                <div className={`h-32 ${sheet.color} relative`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <BookOpen className="h-8 w-8" />
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
                    {sheet.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {sheet.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Problems:
                      </span>
                      <p className="text-blue-600 dark:text-blue-400 font-bold">
                        {sheet.problems}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Time:
                      </span>
                      <p className="text-green-600 dark:text-green-400">
                        {sheet.estimatedTime}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                      Difficulty:
                    </span>
                    <p className="text-orange-600 dark:text-orange-400 text-sm">
                      {sheet.difficulty}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {sheet.tags.slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {sheet.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{sheet.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <Link href={`/practice/dsa/${sheet.id}`} className="block">
                    <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                      Start Learning
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            🎯 Pro Tips for DSA Success
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400">
                📅 Consistency is Key
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Solve 2-3 problems daily rather than cramming. Regular practice
                builds muscle memory.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600 dark:text-green-400">
                🧠 Understand Patterns
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Focus on understanding problem patterns rather than memorizing
                solutions.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-600 dark:text-purple-400">
                ⏱️ Time Complexity First
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Always analyze time and space complexity. Optimize your
                solutions iteratively.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAPracticePage;
