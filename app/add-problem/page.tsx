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
import { useRouter } from "next/navigation";
import { formArrayList } from "@/data/ui/add-problem";

// Form validation schema
const formSchema = z.object({
  problemName: z.string().min(3, "Problem name must be at least 3 characters"),
  problemLink: z.string().url("Please enter a valid URL"),
  platform: z.enum(["codeforces", "leetcode", "geeksforgeeks", "codestudio"]),
  level: z.union([
    z.enum(["easy", "medium", "hard"]),
    z.string().regex(/^[0-9]+$/, "Enter a valid number"),
  ]),
  status: z.enum(["Solved", "Attempted", "Unresolved"]),
});

const AddProblem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problemName: "",
      problemLink: "",
      platform: "leetcode",
      level: "medium",
      status: "Unresolved",
    },
  });

  const isCodeforces = form.watch("platform") === "codeforces";

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Ensure level is always a string before sending to backend
    const submitValues = {
      ...values,
      level:
        typeof values.level === "string" ? values.level : String(values.level),
    };
    // console.log("Form submitted with values:", submitValues);
    setIsLoading(true);
    try {
      const res = await fetch("/api/problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitValues), // don't send user_id
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Failed to save problem");
      }

      const data = await res.json();
      toast.success("Problem saved successfully!");
      form.reset();
      console.log("Problem added:", data);
      router.push(`/code/${data.problem_id}/add-code?from=add-problem`); // Redirect to add code page after successful submission
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
                          {item.name === "level" && isCodeforces ? (
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
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              ))}

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
