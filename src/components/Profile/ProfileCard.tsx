"use client";
import { Posts } from "@/types/response-handlers";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import CardFooter from "../Feed/CardFooter";
import { User } from "next-auth";
import FeatureToggle from "./FeatureToggle";
import DeletePost from "./DeletePost";
import UpdatePostPrompt from "./UpdatePostPrompt";

const ProfileCard = ({
  item,
  index,
  observerRef,
  feedLength,
  user,
  setProfilePosts,
}: {
  item: Posts;
  index: number;
  observerRef?: React.RefObject<HTMLDivElement | null>;
  feedLength: number;
  user: User;
  setProfilePosts: React.Dispatch<React.SetStateAction<Posts[]>>;
}) => {
  const [showComments, setShowComments] = useState(item.toggle.comments);
  const [showDownloads, setShowDownloads] = useState(item.toggle.downloads);
  const [prompt, setPrompt] = useState(item.prompt);
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
            {prompt}
          </span>
        </Link>
        <CardFooter
          user={user}
          post={item}
          toggle={{ comments: showComments, downloads: showDownloads }}
        />
      </div>
      {item.responseType === "image" || item.filePreview ? (
        <Image
          src={
            item.responseType === "image"
              ? item.response
              : item.filePreview || ""
          }
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
            className="dropdown-content menu max-h-75 overflow-auto bg-white text-base-300 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <FeatureToggle
              show={showComments}
              setShow={setShowComments}
              postId={item.postId}
              feature="comments"
            />

            {item.responseType === "image" || item.filePreview ? (
              <>
                <hr className="border-t border-base-300 my-2 ml-2" />
                <FeatureToggle
                  show={showDownloads}
                  setShow={setShowDownloads}
                  postId={item.postId}
                  feature="downloads"
                />
              </>
            ) : null}
            <hr className="border-t border-base-300 my-2 ml-2" />
            <li className="relative">
              <UpdatePostPrompt
                prompt={item.prompt}
                setPrompt={setPrompt}
                postId={item.postId}
              />
            </li>
            <hr className="border-t border-base-300 my-2 ml-2" />
            <li>
              <DeletePost
                setProfilePosts={setProfilePosts}
                postId={item.postId}
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
