"use client";
import { useGlobalStore } from "@/store/global-store";
import React from "react";
import * as motion from "motion/react-client";

const ImageUpload = ({
  setFile,
  fileInputRef,
  stopSpeech,
}: {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  stopSpeech: () => void;
}) => {
  const fileName = useGlobalStore((state) => state.fileName);
  const setFileName = useGlobalStore((state) => state.setFileName);
  const [focused, setFocused] = React.useState(false);
  const loading = useGlobalStore((state) => state.loading);
  const setInputText = useGlobalStore((state) => state.setInputText);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText("");
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };
  const handleDragAndDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setInputText("");
      setFile(droppedFile);
      setFileName(droppedFile.name);
      stopSpeech();
      setFocused(true);
      setTimeout(() => {
        setFocused(false);
      }, 800);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1, borderColor: "" }}
      animate={{
        opacity: 1,
        scale: focused ? 1.1 : 1,
        borderColor: focused ? "var(--color-blue-500)" : "",
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDragAndDrop}
      className={`p-4 rounded-xl border border-solid border-base-content ${loading ? "cursor-not-allowed" : ""}`}
    >
      <motion.label
        initial={{ color: "" }}
        animate={{
          color: focused ? "var(--color-blue-500)" : "",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="text-base text-base-content font-semibold mb-2 block"
      >
        {focused ? "Uploaded successfully!" : "Upload file or Drag & Drop here"}
      </motion.label>
      <div className="relative overflow-hidden">
        <input
          ref={fileInputRef}
          accept="image/*,.pdf,.html,.css,.js,.ts,.tsx,.py"
          onChange={handleFileChange}
          onClick={() => stopSpeech()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDragAndDrop}
          type="file"
          disabled={loading}
          className="w-full text-slate-800 font-semibold text-sm bg-sky-100 border file:cursor-pointer cursor-pointer disabled:cursor-not-allowed disabled:file:cursor-not-allowed file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-sky-500 file:hover:bg-sky-800 file:text-gray-100 rounded"
        />
        {fileName ? (
          <motion.p
            initial={{ color: "" }}
            animate={{
              color: focused ? "var(--color-blue-500)" : "",
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute top-0 right-0 text-sm text-slate-800 w-[calc(100%-7rem)] pointer-events-none rounded-tr rounded-br lg:w-110 py-3 pl-2 mt-0.5 h-[calc(100%-4px)] align-middle text-ellipsis overflow-hidden text-nowrap bg-white z-10"
          >
            {fileName}
          </motion.p>
        ) : null}
      </div>
      <motion.p
        initial={{ color: "" }}
        animate={{
          color: focused ? "var(--color-blue-500)" : "",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="text-xs text-base-content mt-2 mb-4"
      >
        PNG, JPG, SVG, WEBP, GIF, PDFs, HTML, CSS, JS, TS and Py are Allowed.
      </motion.p>
      <motion.p
        initial={{ color: "" }}
        animate={{
          color: focused ? "var(--color-blue-500)" : "",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="text-xs text-base-content mt-2 leading-8"
      >
        NOTE: For{" "}
        <strong className="bg-base-content text-base-100 py-1 px-2 rounded-full text-xs">
          Images
        </strong>{" "}
        , it will provide description and captions and for{" "}
        <strong className="bg-base-content text-base-100 py-1 px-2 rounded-full text-xs">
          PDF
        </strong>
        , it will summarize it.
      </motion.p>
    </motion.div>
  );
};

export default ImageUpload;
