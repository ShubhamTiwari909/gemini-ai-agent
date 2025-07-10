"use client";
import React from "react";
import Modal from "@/components/Settings/Modal";

const DeleteAllPosts = ({
  userId,
  apiAuthToken,
  expressUrl,
}: {
  userId: string;
  apiAuthToken: string;
  expressUrl: string;
}) => {
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${expressUrl}/posts/delete/all`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiAuthToken}`,
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    setMessage(data?.message || "Deleted successfully");
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <>
      <Modal buttonText="Delete All Posts">
        <form onSubmit={handleSubmit}>
          <h3 className="font-bold text-lg mb-2">
            Are you sure you want to delete your account?
          </h3>
          <p className="mb-5">
            This action cannot be undone and will permanently delete your
            account and data.
          </p>
          <button className="btn btn-error" type="submit">
            Delete All Posts
          </button>
        </form>
        {message && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl p-5 rounded-2xl bg-red-200 text-base-300 w-full text-center break-words">
            {message}
          </div>
        )}
      </Modal>
    </>
  );
};

export default DeleteAllPosts;
