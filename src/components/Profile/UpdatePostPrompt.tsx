"use client";
import React, { useRef, useState } from "react";

const UpdatePostPrompt = ({
  postId,
  prompt,
  setPrompt,
}: {
  postId: string;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [newPrompt, setNewPrompt] = useState(prompt);
  const modalRef = useRef<HTMLDialogElement>(null);
  const handleUpdateTitle = async () => {
    fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/posts/update/title`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ postId, newPrompt }),
    })
      .then((res) => res.json())
      .then((res) => {
        setPrompt(res.updatedPost.prompt);
      })
      .finally(() => {
        modalRef.current?.close();
      });
  };
  return (
    <div className="p-0">
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="p-2 text-xs rounded-lg text-base-300 cursor-pointer font-semibold hover:bg-base-300 hover:text-white transition-colors duration-200"
        onClick={() => modalRef.current?.showModal()}
      >
        Update prompt
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <div className="flex flex-col gap-5">
            <input
              type="text"
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              placeholder="Enter new title"
              className="input text-white"
            />

            <div className="modal-action justify-start flex gap-5">
              <button
                onClick={handleUpdateTitle}
                className="btn btn-success w-fit"
              >
                Update Title
              </button>
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-error w-fit">Close</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default UpdatePostPrompt;
