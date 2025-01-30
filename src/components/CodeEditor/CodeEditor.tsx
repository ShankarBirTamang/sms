import React, { useState, useEffect, ChangeEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import MonacoEditor from "@monaco-editor/react";
import useHelpers from "../../hooks/useHelpers";

interface CodeEditorInterface {
  html: string;
  background: FileList | File | string | null;
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
  const { convertFileToBase64 } = useHelpers();
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CodeEditorInterface>();

  const [html, setHtml] = useState("<h1>Hello World</h1>");
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

  //During edit mode set the 'code' from the props to show in iframe
  useEffect(() => {
    if (code) {
      console.log("Updating html state from code:", code);
      setHtml(code);
    }
  }, [code]);

  //Set the initial value of the editor for default for create form submission
  useEffect(() => {
    setValue("html", html);
  }, []);

  //Handle change in the editor, this html State is just to show the changes in the editor
  const handleChange = (value: any) => {
    setHtml(value || "");
  };

  const backgroundImages = watch("background");
  //For previewing the background image in iframe

  async function uploadBackgroundImage() {
    if (backgroundImages instanceof FileList && backgroundImages[0]) {
      const file = backgroundImages[0];
      try {
        const backgroundBase64 = await convertFileToBase64(file);
        setBackgroundUrl(backgroundBase64);
        setValue("background", backgroundBase64);
      } catch (error) {
        console.log("Error uploading background image", error);
      }
    } else if (typeof backgroundImages === "string") {
      setBackgroundUrl(backgroundImages);
    } else {
      setBackgroundUrl(null);
    }
  }

  useEffect(() => {
    uploadBackgroundImage();
  }, [backgroundImages]);

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
