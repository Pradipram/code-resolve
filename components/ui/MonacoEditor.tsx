import dynamic from "next/dynamic";
import React from "react";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  { ssr: false }
);

export default MonacoEditor;
