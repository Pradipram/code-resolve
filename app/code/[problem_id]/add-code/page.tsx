"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Form } from "@/components/ui/form";
import { AddCodeFormSchema } from "@/zod-schemas/schemas";
import { AddCodeFormFields, extToLang } from "@/data/ui/add-code";
import { generateFormUI } from "@/lib/generateFormUI";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "react-toastify";

const AddCodePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "view-code";
  const problemName = searchParams.get("problem_name") || "";
  const { problem_id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const AddCodeForm = useForm<z.infer<typeof AddCodeFormSchema>>({
    resolver: zodResolver(AddCodeFormSchema),
    defaultValues: {
      title: "",
      language: "cpp",
      note: "",
      code: "",
    },
  });

  const handleAdd = async (values: z.infer<typeof AddCodeFormSchema>) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/code/${problem_id}/add-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      console.log("Response:", res);
      if (!res.ok) {
        if (res.status === 500) {
          toast.error("Internal server error. Please try again later.");
        } else throw new Error("Failed to add code");
      }
      // Optionally show toast
      else {
        toast.success("Code added successfully");
        if (from === "add-problem") {
          router.push("/dashboard");
        } else {
          router.push(`/code/${problem_id}/view-code`);
        }
      }
    } catch (err) {
      // Optionally show error toast
      toast.error("Something went wrong");
      console.error("Error adding code:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    if (from === "view-code") {
      router.push(`/code/${problem_id}/view-code`);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-3xl rounded-xl border p-6 shadow bg-white dark:bg-gray-900 mx-auto my-6">
      <h2 className="text-lg font-bold mb-4 text-center">
        Add code for your problem
        <span className="text-gray-500"> [{problemName}]</span>
      </h2>
      <Form {...AddCodeForm}>
        <form
          onSubmit={AddCodeForm.handleSubmit(handleAdd)}
          className="space-y-6"
        >
          {generateFormUI({
            form: AddCodeForm,
            fields: AddCodeFormFields,
          })}
          <div className="flex justify-center gap-4">
            <Button type="submit">
              {isLoading ? "Adding..." : "Add Code"}
            </Button>
            <Button type="button" variant="outline" onClick={handleSkip}>
              Skip
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddCodePage;
