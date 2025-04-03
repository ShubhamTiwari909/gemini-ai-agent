import { formatDate } from "@/lib/utils";
import { CreateAtAndUserName } from "@/types/utils";
import Link from "next/link";
import React from "react";

const CreatedAtByUsername = ({
  createdAt,
  username,
  usermail,
}: CreateAtAndUserName) => {
  return (
    createdAt && (
      <p className="text-sm lg:text-lg text-base-content font-semibold mb-5">
        Created - {formatDate(createdAt || "")} {username ? "by " : ""}
        {username ? (
          <Link
            href={`/users/${usermail}`}
            className="mt-2 lg:mt-0 inline-block font-bold py-2 px-4 rounded-full bg-base-content text-base-100 lg:ml-2"
          >
            {username}
          </Link>
        ) : (
          ""
        )}
      </p>
    )
  );
};

export default CreatedAtByUsername;
