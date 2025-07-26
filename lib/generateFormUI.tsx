import React, { RefObject } from "react";
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

// Types for the field array and form instance

interface FieldDef<Name extends string = string> {
  type: string;
  name: Name;
  label: string;
  placeholder?: string;
  options?: string[];
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
  fileInputRef,
  handleUpload,
}: GenerateFormUIProps<Name>) {
  return fields.map((item) => (
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
  ));
}
