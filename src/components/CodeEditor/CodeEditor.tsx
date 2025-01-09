import React, { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import MonacoEditor from "@monaco-editor/react";

interface CodeEditorInterface {
  code: string;
}

const MonacoEditorWrapper = React.forwardRef((props: any, ref) => {
  return <MonacoEditor {...props} />;
});

const CodeEditor = () => {
  //We can omit SetValues and it still works.. Why?
  const { control, setValue, getValues } =
    useFormContext<CodeEditorInterface>();
  const [html, setHtml] = useState(getValues("code") || "<h1>Hello World</h1>");
  const [iframeContent, setIframeContent] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIframeContent(html);
      setValue("code", html);
    }, 300);

    return () => clearTimeout(timeout);
  }, [html, setValue]);

  const handleChange = (value: any) => {
    setHtml(value || "");
  };

  return (
    <div
      style={{ display: "flex", height: "60vh", margin: "3rem 0", gap: "2rem" }}
    >
      <div
        style={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3>HTML</h3>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <MonacoEditorWrapper
              {...field}
              height="92%"
              defaultLanguage="html"
              value={html}
              //String or any??
              onChange={(value: any) => {
                handleChange(value);
                field.onChange(value || ""); // Update form state
              }}
              options={{ minimap: { enabled: true } }}
              theme="vs-dark"
            />
          )}
        />
      </div>
      <div
        style={{
          width: "50%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <h3>Output Design</h3>
        <iframe
          className="card"
          srcDoc={iframeContent}
          title="Output"
          style={{ width: "100%", height: "92%", border: "1px solid #ccc" }}
          sandbox="allow-scripts"
        ></iframe>
      </div>
    </div>
  );
};

export default CodeEditor;
