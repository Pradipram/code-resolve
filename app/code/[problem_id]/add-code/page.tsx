"use client";

import React, { useState, useRef } from "react";
import MonacoEditor from "@/components/ui/MonacoEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AddCodeFormSchema } from "@/zod-schemas/add-code";
import { AddCodeFormFields, extToLang } from "@/data/ui/add-code";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Textarea } from "@/components/ui/textarea";

const AddCodePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "view-code";
  const problemName = searchParams.get("problem_name") || "";
  const { problem_id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const AddCodeForm = useForm<z.infer<typeof AddCodeFormSchema>>({
    resolver: zodResolver(AddCodeFormSchema),
    defaultValues: {
      title: "",
      language: "cpp",
      note: "",
      code: "",
    },
  });

  // Handle file upload, set code and language in form
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const extension = file.name.split(".").pop()?.toLowerCase();
    // Map file extension to language
    const detectedLang =
      extension && extToLang[extension] ? extToLang[extension] : undefined;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (detectedLang) {
        AddCodeForm.setValue("language", detectedLang);
        console.log("Detected language:", detectedLang);
      }
      const text = event.target?.result as string;
      AddCodeForm.setValue("code", text || "");
    };
    reader.readAsText(file);
    // Reset input so same file can be uploaded again if needed
    e.target.value = "";
  };

  const handleAdd = async (values: z.infer<typeof AddCodeFormSchema>) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/code/${problem_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to add code");
      // Optionally show toast
      if (from === "add-problem") {
        router.push("/dashboard");
      } else {
        router.push(`/code/${problem_id}/view-code`);
      }
    } catch (err) {
      // Optionally show error toast
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
    <div className="w-full max-w-lg rounded-xl border p-6 shadow bg-white dark:bg-gray-900 mx-auto my-6">
      <h2 className="text-lg font-bold mb-4 text-center">
        Add code for your problem
        <span className="text-gray-500"> [{problemName}]</span>
      </h2>
      <Form {...AddCodeForm}>
        <form
          onSubmit={AddCodeForm.handleSubmit(handleAdd)}
          className="space-y-6"
        >
          {AddCodeFormFields.map((item) => (
            <FormField
              key={item.name}
              control={AddCodeForm.control}
              name={item.name}
              render={({ field }) => (
                <FormItem className="flex items-center gap-4 w-full">
                  <FormLabel className="w-1/4 text-center gap-4">
                    {item.label}
                  </FormLabel>
                  <div className="w-3/4">
                    <FormControl>
                      {/* Only one child allowed for FormControl, so use a fragment and conditional rendering */}
                      <div className="flex items-center gap-2">
                        {item.type === "input" && (
                          <Input placeholder={item.placeholder} {...field} />
                        )}
                        {item.type === "select" && (
                          <Select
                            // onValueChange={field.onChange}
                            // defaultValue={field.value}
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  item.placeholder || "Choose an option"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {item.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {item.type === "textarea" && (
                          <Textarea {...field} placeholder={item.placeholder} />
                        )}
                        {item.type === "code" && (
                          <div className="flex-col w-full">
                            <MonacoEditor
                              value={field.value}
                              language={AddCodeForm.watch("language")}
                              height="200px"
                              theme="vs-dark"
                              onChange={(value) => field.onChange(value || "")}
                            />
                            <Button
                              type="button"
                              variant="link"
                              size="sm"
                              className="ml-2"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              Add code from file
                            </Button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".txt,.cpp,.py,.js,.ts,.java,.c,.cs,.go,.rb,.rs,.swift,.kt,.php,.sh,.json,.md,.html,.css,.xml,.sql,.yaml,.yml,.pl,.r,.scala,.dart,.m,.vb,.lua,.hs,.jl,.tsx,.jsx"
                              style={{ display: "none" }}
                              onChange={handleUpload}
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          ))}
          <div className="flex justify-center">
            <Button type="submit">
              {isLoading ? "Adding..." : "Add Code"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddCodePage;
