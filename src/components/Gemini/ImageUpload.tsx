import React from "react";

const ImageUpload = ({
  setFile,
}: {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  return (
    <div>
      <label className="text-base text-base-content font-semibold mb-2 block">
        Upload file
      </label>
      <input
        accept="image/*"
        onChange={handleFileChange}
        type="file"
        className="w-full text-slate-800 font-semibold text-sm bg-sky-100 border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-sky-500 file:hover:bg-sky-800 file:text-gray-100 rounded"
      />
      <p className="text-xs text-base-content mt-2">
        PNG, JPG SVG, WEBP, and GIF are Allowed.
      </p>
    </div>
  );
};

export default ImageUpload;
