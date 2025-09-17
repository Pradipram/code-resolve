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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { formArrayList } from "@/data/ui/add-problem";
import { AddProblemFormSchema } from "@/zod-schemas/schemas";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Form validation schema

const AddProblem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Initialize form
  const form = useForm<z.infer<typeof AddProblemFormSchema>>({
    resolver: zodResolver(AddProblemFormSchema),
    defaultValues: {
      problemName: "",
      problemLink: "",
      platform: "leetcode",
      level: "medium",
      status: "Unsolved",
    },
  });

  // Auto-detect platform from problemLink
  useEffect(() => {
    const link = form.watch("problemLink");
    if (!link) return;
    let detected: string | undefined = undefined;
    if (link.includes("codeforces.com")) detected = "codeforces";
    else if (link.includes("leetcode.com")) detected = "leetcode";
    else if (link.includes("geeksforgeeks.org")) detected = "geeksforgeeks";
    else if (link.includes("naukri.com")) detected = "codestudio";
    if (detected && form.getValues("platform") !== detected) {
      form.setValue(
        "platform",
        detected as "codeforces" | "leetcode" | "geeksforgeeks" | "codestudio"
      );
    }
  }, [form]);

  // Removed unused variable isCodeforces

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof AddProblemFormSchema>) => {
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
        const errObj = await res.json();
        throw new Error(errObj?.error || "Failed to save problem");
      }

      const data = await res.json();
      toast.success("Problem saved successfully!");
      form.reset();
      console.log("Problem added:", data);
      router.push(
        `/code/${data.problem_id}/add-code?from=add-problem&problem_name=${data.problem_name}`
      ); // Redirect to add code page after successful submission
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Submit error:", error);
      toast.error(errorMsg || "Something went wrong");
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
              {/* Dynamically render all fields using GenerateFormUI */}
              {/* {GenerateFormUI({
                form: form,
                fields: formArrayList,
              })} */}
              {formArrayList.map((item) => {
                if (
                  item.name === "level" &&
                  form.watch("platform") === "codeforces"
                ) {
                  return (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-4 w-full">
                          <FormLabel className="w-1/4 text-center gap-4">
                            Difficulty Level
                          </FormLabel>
                          <div className="w-3/4">
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="800"
                                {...field}
                                min={800}
                                max={4000}
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  );
                }
                // Default rendering for all other fields

                return (
                  <FormField
                    key={item.name}
                    control={form.control}
                    name={item.name}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4 w-full">
                        <FormLabel className="w-1/4 text-center gap-4">
                          {item.label}
                        </FormLabel>
                        <div className="w-3/4">
                          <FormControl>
                            <div className="flex items-center gap-2">
                              {item.type === "input" && (
                                <Input
                                  placeholder={item.placeholder}
                                  {...field}
                                />
                              )}
                              {item.type === "select" && (
                                <Select
                                  value={field.value}
                                  onValueChange={(value) =>
                                    field.onChange(value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={
                                        item.placeholder || "Choose an option"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {item.options?.map((option) =>
                                      typeof option === "string" ? (
                                        <SelectItem key={option} value={option}>
                                          {option}
                                        </SelectItem>
                                      ) : (
                                        <SelectItem
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              )}
                              {item.type === "textarea" && (
                                <Textarea
                                  {...field}
                                  placeholder={item.placeholder}
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                );
              })}
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
