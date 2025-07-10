import React from "react";
import Modal from "@/components/Settings/Modal";
import { signOut } from "@/app/api/auth/nextAuth";

const DeleteAccount = ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  return (
    <Modal buttonText="Delete Account">
      <form
        action={async () => {
          "use server";
          const response = await fetch(
            `${process.env.EXPRESS_API_URL}/users/deleteAccount`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
              },
              body: JSON.stringify({ userId, email }),
            },
          );
          if (response.ok) {
            await signOut();
          }
        }}
      >
        <h3 className="font-bold text-lg mb-2">
          Are you sure you want to delete your account?
        </h3>
        <p className="mb-5">
          This action cannot be undone and will permanently delete your account
          and data.
        </p>
        <button className="btn btn-error" type="submit">
          Delete Account
        </button>
      </form>
    </Modal>
  );
};

export default DeleteAccount;
