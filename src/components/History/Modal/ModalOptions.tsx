import { History } from "@/types/response-handlers";
import Link from "next/link";
import React from "react";
import { MdArrowOutward, MdFileCopy, MdOutlineFileCopy } from "react-icons/md";

const ModalOptions = ({ activeHistory }: { activeHistory: History | null }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.href}history/${activeHistory?._id}`,
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <div className="space-y-5 bg-base-content p-4 rounded-xl absolute">
      <Link
        className="btn btn-sm lg:btn-md btn-bordered btn-info"
        href={`/history/${activeHistory?._id}`}
      >
        <MdArrowOutward
          color="text-base-content !size-4 lg:!size-5"
          size="1.25rem"
        />
      </Link>
      <button className="btn btn-sm lg:btn-md" onClick={handleCopyLink}>
        {copied ? (
          <div className="flex items-center gap-x-1">
            <MdFileCopy size="1.25rem" className="size-4 lg:size-5" />
          </div>
        ) : (
          <MdOutlineFileCopy size="1.25rem" className="size-4 lg:size-5" />
        )}
      </button>
    </div>
  );
};

export default ModalOptions;
