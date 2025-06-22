import { downloadImage } from "@/lib/utils";
import React from "react";
import { LuDownload } from "react-icons/lu";

const ViewDownload = ({
  response,
  prompt,
  postId,
  downloads,
}: {
  response: string;
  prompt: string;
  postId: string;
  downloads: number | undefined;
}) => {
  const [downloadCount, setDownloadsCount] = React.useState(downloads);
  const handleDownloads = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_EXPRESS_API_URL as string}/posts/updateDownloads`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          postId,
        }),
      },
    )
      .then((res) => res.json())
      .then((result) => {
        setDownloadsCount(result.downloads);
      });
  };
  return (
    <button
      className="text-white text-md cursor-pointer text-sm flex items-center gap-2"
      onClick={() => {
        downloadImage(response as string, prompt as string);
        handleDownloads();
      }}
    >
      <LuDownload /> {downloadCount}
    </button>
  );
};

export default ViewDownload;
