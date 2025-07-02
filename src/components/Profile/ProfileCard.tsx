"use client";
import { Posts } from "@/types/response-handlers";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import CardFooter from "../Feed/CardFooter";
import { User } from "next-auth";

const ProfileCard = ({
  item,
  index,
  observerRef,
  feedLength,
  user,
}: {
  item: Posts;
  index: number;
  observerRef?: React.RefObject<HTMLDivElement | null>;
  feedLength: number;
  user: User;
}) => {
  const [showComments, setShowComments] = useState(item.toggle.comments);

  const handleToggleComments = (postId: string, commentToggle: boolean) => {
    fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/posts/toggle/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ postId, value: commentToggle }), // Use the passed commentToggle value
    }).then((res) => {
      if (res.ok) {
        setShowComments(commentToggle);
      }
    });
  };
  return (
    <div
      key={item._id}
      ref={index === feedLength - 1 ? observerRef : null}
      className="mb-5 min-h-100 bg-base-100 rounded-2xl p-10 border border-base-content text-white relative"
    >
      <div className="flex flex-col justify-between h-full z-20 relative">
        <Link
          href={`/post/${item._id}`}
          className="flex flex-col justify-between mb-2 lg:max-w-80 line-clamp-1 text-ellipsis relative"
        >
          <span className="inline-block mb-4 font-semibold w-fit">
            {item.prompt}
          </span>
        </Link>
        <CardFooter user={user} post={item} />
      </div>
      {item.responseType === "image" ? (
        <Image
          src={item.response}
          alt={item.prompt}
          fill
          className="z-0 opacity-40 rounded-2xl object-cover"
        />
      ) : null}
      <div className="absolute top-2 right-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="m-1 cursor-pointer p-2 font-bold"
          >
            <BsThreeDotsVertical size="1.2rem" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-white text-base-300 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li>
              <button
                onClick={() =>
                  handleToggleComments(item.postId, !item.toggle.comments)
                }
              >
                {showComments ? "Hide Comments" : "Show Comments"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
