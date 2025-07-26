import React, { RefObject, useRef } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import MonacoEditor from "@/components/ui/MonacoEditor";
import { Button } from "@/components/ui/button";
import { extToLang } from "@/data/ui/add-code";

// Types for the field array and form instance

interface FieldDef<Name extends string = string> {
  type: string;
  name: Name;
  label: string;
  placeholder?: string;
  options?: string[] | { value: string; label: string }[];
  min?: number;
  max?: number;
}

type FormInstance<Name extends string = string> = {
  control: any;
  watch: (name: Name) => any;
  setValue: (name: Name, value: any, options?: any) => void;
};

interface GenerateFormUIProps<Name extends string = string> {
  form: FormInstance<Name>;
  fields: FieldDef<Name>[];
  fileInputRef?: RefObject<HTMLInputElement | null>;
  handleUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function generateFormUI<Name extends string = string>({
  form,
  fields,
}: GenerateFormUIProps<Name>) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        form.setValue("language" as Name, detectedLang);
        console.log("Detected language:", detectedLang);
      }
      const text = event.target?.result as string;
      form.setValue("code" as Name, text || "");
    };
    reader.readAsText(file);
    // Reset input so same file can be uploaded again if needed
    e.target.value = "";
  };

  return fields.map((item) => {
    // Special handling for codeforces level field
    if (
      item.name === "level" &&
      form.watch("platform" as Name) === "codeforces"
    ) {
      return (
        <FormField
          key={item.name}
          control={form.control}
          name={item.name}
          render={({ field }: any) => (
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
        render={({ field }: any) => (
          <FormItem className="flex items-center gap-4 w-full">
            <FormLabel className="w-1/4 text-center gap-4">
              {item.label}
            </FormLabel>
            <div className="w-3/4">
              <FormControl>
                <div className="flex items-center gap-2">
                  {item.type === "input" && (
                    <Input placeholder={item.placeholder} {...field} />
                  )}
                  {item.type === "select" && (
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={item.placeholder || "Choose an option"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {item.options?.map((option) =>
                          typeof option === "string" ? (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ) : (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          )
                        )}
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
                        language={form.watch("language" as Name)}
                        height="200px"
                        theme="vs-dark"
                        onChange={(value) => field.onChange(value || "")}
                      />
                      {fileInputRef && handleUpload && (
                        <>
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
                        </>
                      )}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    );
  });
}
