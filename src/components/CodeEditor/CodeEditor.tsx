import React, { useState, useEffect, ChangeEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import MonacoEditor from "@monaco-editor/react";

interface CodeEditorInterface {
  code: string;
  backgroundImage: FileList | null;
}

interface CodeEditorProps {
  iframeHeight: number;
  iframeWidth: number;
  orientation: string;
  wantBackgroundImage: boolean;
}

const MonacoEditorWrapper = React.forwardRef((props: any, ref) => {
  return <MonacoEditor {...props} />;
});

const CodeEditor = ({
  iframeHeight,
  iframeWidth,
  orientation,
  wantBackgroundImage,
}: CodeEditorProps) => {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(
    null
  );

  //We can omit SetValues and it still works.. Why?
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext<CodeEditorInterface>();
  const [html, setHtml] = useState(getValues("code") || "<h1>Hello World</h1>");
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

  const handleBackgroundChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const backgroundUrl = URL.createObjectURL(file);
      setBackgroundImageUrl(backgroundUrl);
    } else {
      setBackgroundImageUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (backgroundImageUrl) {
        URL.revokeObjectURL(backgroundImageUrl);
      }
    };
  }, [backgroundImageUrl]);

  if (orientation === "landscape") {
    // Swap height and width for landscape orientation
    [iframeHeight, iframeWidth] = [iframeWidth, iframeHeight];
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-5 mb-4">
          {wantBackgroundImage && (
            <div className="mb-1">
              <label htmlFor="backgroundImage" className="required form-label">
                Background Image
              </label>
              <Controller
                name="backgroundImage"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <input
                    {...field}
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    id="backgroundImage"
                    className="form-control form-control-solid"
                    value={undefined}
                    onChange={(e) => {
                      handleBackgroundChange(e); // Handle the background image change
                      field.onChange(e.target.files); // Ensure the FileList is passed to the form state
                    }}
                  />
                )}
              />
              <span className="text-danger">
                {errors.backgroundImage?.message}
              </span>
            </div>
          )}

          <div>
            <h3>HTML</h3>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <MonacoEditorWrapper
                  {...field}
                  height="65vh"
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
          <div style={{ transform: "scale(0.8)" }}>
            <iframe
              srcDoc={iframeContent}
              title="Output"
              style={{
                boxShadow: "0 0 11px 11px #d7ebff",
                height: `${iframeHeight}mm`,
                width: `${iframeWidth}mm`,
                overflow: "hidden",
                backgroundImage: backgroundImageUrl
                  ? `url('${backgroundImageUrl}')`
                  : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              sandbox="allow-scripts"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
