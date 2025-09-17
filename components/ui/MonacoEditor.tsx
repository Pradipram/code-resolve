import dynamic from "next/dynamic";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  { ssr: false }
);

export default MonacoEditor;
