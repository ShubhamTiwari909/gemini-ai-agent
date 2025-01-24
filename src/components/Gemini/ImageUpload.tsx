"use client";
import { useGlobalStore } from "@/store/global-store";
import React from "react";

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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setFile(droppedFile);
      setFileName(droppedFile.name);
      stopSpeech();
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDragAndDrop}
      className="p-4 rounded-xl border border-dotted border-base-content"
    >
      <label className="text-base text-base-content font-semibold mb-2 block">
        Upload file or Drag & Drop here
      </label>
      <div className="relative overflow-hidden">
        <input
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          onClick={() => stopSpeech()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDragAndDrop}
          type="file"
          className="w-full text-slate-800 font-semibold text-sm bg-sky-100 border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-sky-500 file:hover:bg-sky-800 file:text-gray-100 rounded"
        />
        {fileName ? (
          <p className="absolute top-0 right-0 text-sm text-base-200 w-48 py-3 pl-2 lg:pl-0 h-full text-ellipsis overflow-hidden text-nowrap bg-sky-100 z-10">
            {fileName}
          </p>
        ) : null}
      </div>
      <p className="text-xs text-base-content mt-2">
        PNG, JPG SVG, WEBP, and GIF are Allowed.
      </p>
    </div>
  );
};

export default ImageUpload;
