import React, { useState, useEffect, ChangeEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import MonacoEditor from "@monaco-editor/react";

interface CodeEditorInterface {
  html: string;
  background: FileList | null;
}

interface CodeEditorProps {
  iframeHeight: number;
  iframeWidth: number;
  orientation: string;
  wantBackground: boolean;
  scale: number;
  code?: string;
}

const MonacoEditorWrapper = React.forwardRef((props: any, ref) => {
  return <MonacoEditor {...props} />;
});

const CodeEditor = ({
  iframeHeight,
  iframeWidth,
  orientation,
  wantBackground,
  scale,
  code,
}: CodeEditorProps) => {
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

  console.log("code", code);

  //We can omit SetValues and it still works.. Why?
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext<CodeEditorInterface>();
  const [html, setHtml] = useState(code || "<h1>Hello World</h1>");
  const [iframeContent, setIframeContent] = useState("");

  useEffect(() => {
    setHtml(code || "<h1>Hello World</h1>");
  }, [code]);

  useEffect(() => {
    setIframeContent(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                html, body {
                  margin: 0;
                  padding: 0;
                  height: 100%;
                  width: 100%;
                  overflow: hidden;
                }
              </style>
            </head>
            <body>
              ${html}
            </body>
          </html>
        `);
  }, [html]);

  const handleChange = (value: any) => {
    setHtml(value || "");
  };

  const handleBackgroundChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const backgroundUrl = URL.createObjectURL(file);
      setBackgroundUrl(backgroundUrl);
    } else {
      setBackgroundUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (backgroundUrl) {
        URL.revokeObjectURL(backgroundUrl);
      }
    };
  }, [backgroundUrl]);

  if (orientation === "landscape") {
    // Swap height and width for landscape orientation
    [iframeHeight, iframeWidth] = [iframeWidth, iframeHeight];
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-5 mb-4">
          {wantBackground && (
            <div className="mb-5">
              <label htmlFor="background" className="required form-label">
                Background Image
              </label>
              <Controller
                name="background"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <input
                    {...field}
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    id="background"
                    className="form-control form-control-solid"
                    value={undefined}
                    onChange={(e) => {
                      handleBackgroundChange(e); // Handle the background image change
                      field.onChange(e.target.files); // Ensure the FileList is passed to the form state
                    }}
                  />
                )}
              />
              <span className="text-danger">{errors.background?.message}</span>
            </div>
          )}

          <div>
            <h3>HTML</h3>
            <Controller
              name="html"
              control={control}
              render={({ field }) => (
                <MonacoEditorWrapper
                  {...field}
                  height="70vh"
                  defaultLanguage="html"
                  value={html}
                  onChange={(value: any) => {
                    handleChange(value);
                    field.onChange(value);
                  }}
                  options={{ minimap: { enabled: true } }}
                  theme="vs-dark"
                />
              )}
            />
          </div>
        </div>

        <div className="col-md-7 p-0">
          <span style={{ transform: `scale(${scale})` }} className="">
            <iframe
              className="card"
              srcDoc={iframeContent}
              title="Output"
              style={{
                boxShadow: "0 0 11px 11px #d7ebff",
                height: `${iframeHeight}mm`,
                width: `${iframeWidth}mm`,
                overflow: "hidden",
                backgroundImage: backgroundUrl
                  ? `url('${backgroundUrl}')`
                  : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              sandbox="allow-scripts"
            ></iframe>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
