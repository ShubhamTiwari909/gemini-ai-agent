import { compactNumberFormat } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { FaComments } from "react-icons/fa";

const ViewComments = ({
  commentsLength,
  postId,
}: {
  commentsLength: number;
  postId: string | undefined;
}) => {
  return (
    <Link
      href={`/post/${postId}`}
      className="flex items-center gap-x-2 text-white text-sm"
    >
      <FaComments className="text-slate-100" />{" "}
      {compactNumberFormat(commentsLength)}
    </Link>
  );
};

export default ViewComments;
