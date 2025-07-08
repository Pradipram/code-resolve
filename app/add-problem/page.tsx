"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MonacoEditor from "@/components/ui/MonacoEditor";
import { toast } from "react-toastify";

// Form validation schema
const formSchema = z.object({
  problemName: z.string().min(3, "Problem name must be at least 3 characters"),
  problemLink: z.string().url("Please enter a valid URL"),
  platform: z.enum(["codeforces", "leetcode", "geeksforgeeks", "codestudio"]),
  level: z.union([
    z.enum(["easy", "medium", "hard"]),
    z.number().int().positive(),
  ]),
  status: z.enum(["done", "revisit", "pending"]),
  language: z.enum(["cpp", "python", "java", "javascript", "c", "typescript"]),
  code: z.string().optional(),
});

type FormFieldName =
  | "problemName"
  | "problemLink"
  | "platform"
  | "level"
  | "status"
  | "language"
  | "code";
type FormArrayListItem = {
  name: FormFieldName;
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
};

const formArrayList: FormArrayListItem[] = [
  {
    name: "problemName",
    label: "Problem Name",
    placeholder: "Two Sum",
  },
  {
    name: "problemLink",
    label: "Problem Link",
    placeholder: "https://leetcode.com/problems/two-sum/",
  },
  {
    name: "platform",
    label: "Platform",
    options: [
      { value: "leetcode", label: "LeetCode" },
      { value: "codeforces", label: "Codeforces" },
      { value: "geeksforgeeks", label: "GeeksforGeeks" },
      { value: "codestudio", label: "CodeStudio" },
    ],
  },
  {
    name: "level",
    label: "Difficulty Level",
    options: [
      { value: "easy", label: "Easy" },
      { value: "medium", label: "Medium" },
      { value: "hard", label: "Hard" },
    ],
  },
  {
    name: "status",
    label: "Status",
    options: [
      { value: "done", label: "Done" },
      { value: "revisit", label: "Revisit" },
      { value: "pending", label: "Pending" },
    ],
  },
  {
    name: "language",
    label: "Language",
    options: [
      { value: "cpp", label: "C++" },
      { value: "python", label: "Python" },
      { value: "java", label: "Java" },
      { value: "javascript", label: "JavaScript" },
      { value: "c", label: "C" },
      { value: "typescript", label: "TypeScript" },
    ],
  },
];

const AddProblem = () => {
  const [isPlatformCodeforces, setIsPlatformCodeforces] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problemName: "",
      problemLink: "",
      platform: "leetcode",
      level: "medium",
      status: "pending",
      language: "cpp",
      code: "",
    },
  });

  // Watch for platform changes
  const platform = form.watch("platform");
  const problemLink = form.watch("problemLink");

  // Update level field based on platform
  useEffect(() => {
    const isCodeforces = platform === "codeforces";
    setIsPlatformCodeforces(isCodeforces);

    // Reset level value when switching platforms
    if (isCodeforces) {
      form.setValue("level", 800);
      form.setValue("platform", "codeforces");
    } else {
      form.setValue("level", "medium");
    }
  }, [platform, form]);

  // Try to detect platform from URL
  useEffect(() => {
    if (!problemLink) return;

    try {
      const url = new URL(problemLink);
      if (url.hostname.includes("leetcode")) {
        form.setValue("platform", "leetcode");
      } else if (url.hostname.includes("codeforces")) {
        form.setValue("platform", "codeforces");
      } else if (
        url.hostname.includes("geeksforgeeks") ||
        url.hostname.includes("gfg")
      ) {
        form.setValue("platform", "geeksforgeeks");
      } else if (
        url.hostname.includes("codingninjas") ||
        url.hostname.includes("codestudio")
      ) {
        form.setValue("platform", "codestudio");
      }
    } catch (e) {
      // Invalid URL, do nothing
    }
  }, [problemLink, form]);

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // don't send user_id
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Failed to save problem");
      }

      const data = await res.json();
      toast.success("Problem saved successfully!");
      form.reset();
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-6 w-full ">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Add New Problem</CardTitle>
          <CardDescription>
            Add a new coding problem to your collection for practice or revision
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {formArrayList.map((item) => (
                <FormField
                  key={item.name}
                  control={form.control}
                  name={item.name}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="w-1/3 text-right">
                        {item.label}
                      </FormLabel>
                      <div className="w-2/3">
                        <FormControl>
                          {item.name === "level" && isPlatformCodeforces ? (
                            <Input
                              type="number"
                              placeholder="800"
                              {...field}
                              min={800}
                              max={4000}
                              className="w-full"
                            />
                          ) : item.options ? (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value as string}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={item.label} />
                              </SelectTrigger>
                              <SelectContent>
                                {item.options.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input placeholder={item.placeholder} {...field} />
                          )}
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              ))}

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-4">
                    <FormLabel className="w-1/3 text-right pt-2">
                      Code
                    </FormLabel>
                    <div className="w-2/3">
                      <FormControl className="h-50">
                        <MonacoEditor
                          height="350"
                          language={form.watch("language")}
                          theme="vs-dark"
                          value={field.value}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                          }}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="w-1/3 min-w-[120px]"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Problem"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProblem;
