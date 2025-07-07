"use client";
import { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

const Voters = ({ voters }: { voters: { user?: User | undefined }[] }) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    return () => {
      if (modalRef.current) {
        modalRef.current.close();
      }
    };
  }, [modalRef]);
  return (
    <div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      {voters.length > 0 && (
        <button
          className="p-1 cursor-pointer mt-1"
          onClick={() => modalRef.current?.showModal()}
        >
          See votes
        </button>
      )}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          {
            <ul>
              {voters.map((voter) => (
                <li
                  key={voter.user?.email}
                  className="flex items-center gap-3 mb-3"
                >
                  <Link
                    href={`/users/${voter.user?.userId}`}
                    className="flex items-center gap-3"
                    onClick={() => modalRef.current?.close()}
                  >
                    <Image
                      src={voter.user?.image || ""}
                      alt={voter.user?.name || ""}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <p>{voter.user?.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          }
          <div className="modal-action">
            <button
              className="btn btn-error"
              onClick={() => modalRef.current?.close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Voters;
