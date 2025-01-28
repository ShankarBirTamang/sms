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
  orientation?: string;
  wantBackground: boolean;
  scale?: number;
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
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CodeEditorInterface>();
  const [html, setHtml] = useState(code || "<h1>Hello World</h1>");
  setValue("html", html);
  const [iframeContent, setIframeContent] = useState("");

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

  const backgroundImage = watch("background");
  //For previewing the background image in iframe
  useEffect(() => {
    if (backgroundImage instanceof FileList && backgroundImage[0]) {
      const file = backgroundImage[0];
      const backgroundUrl = URL.createObjectURL(file);
      setBackgroundUrl(backgroundUrl);

      return () => {
        URL.revokeObjectURL(backgroundUrl); // Clean up the object URL
      };
    } else if (typeof backgroundImage === "string") {
      setBackgroundUrl(backgroundImage);
    } else {
      setBackgroundUrl(null);
    }
  }, [backgroundImage]);

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
                      if (e.target.files && e.target.files[0]) {
                        field.onChange(e.target.files); // Update the form field with the selected file
                      } else {
                        field.onChange(null); // Reset if no file is selected
                      }
                    }}
                  />
                )}
              />
              <span className="text-danger">{errors.background?.message}</span>
            </div>
          )}

          <div className="m-5">
            <h3>HTML</h3>
            <span className="text-danger">{errors.html?.message}</span>
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

        <div className="col-md-7 p-0 d-flex justify-content-center align-items-center">
          <span>
            <iframe
              className=" card"
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
                // backgroundSize: "cover",
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
                transform: `scale(${scale})`,
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
