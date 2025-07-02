"use client";
import { copyLinkToClipboard } from "@/lib/utils";
import React from "react";
import { FaCopy, FaRegCopy } from "react-icons/fa";

const CopyLink = ({ id }: { id: string | undefined }) => {
  const [copy, setCopy] = React.useState<boolean>(false);

  return (
    <button
      className="ml-auto cursor-pointer relative"
      onClick={() => {
        setCopy(true);
        copyLinkToClipboard(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/post/${id}`);
        setTimeout(() => {
          setCopy(false);
        }, 2000);
      }}
    >
      {copy ? (
        <span className="text-xs text-white inline-block absolute -top-10 right-0">
          Link Copied!
        </span>
      ) : null}
      {copy ? (
        <FaCopy size="0.9rem" color="#ffffff" />
      ) : (
        <FaRegCopy size="0.9rem" color="#ffffff" />
      )}
    </button>
  );
};

export default CopyLink;
