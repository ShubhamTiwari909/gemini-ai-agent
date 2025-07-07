"use client";
import React, { useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MdAdd, MdDelete } from "react-icons/md";
import { User } from "next-auth";
import { revalidatePage } from "@/actions/revalidatePolls";

const formSchema = z.object({
  poll: z.object({
    question: z.string().min(2).max(100),
    options: z
      .array(
        z.object({
          answer: z.string().min(1, "Answer is required"),
        }),
      )
      .min(1, "At least one option is required")
      .max(8, "A maximum of 8 options is allowed"),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const CreatePoll = ({ user }: { user: User | undefined }) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      poll: { question: "", options: [{ answer: "" }] },
    },
    mode: "all",
  });

  const {
    fields: pollOptions,
    append: appendPollOption,
    remove: removePollOption,
  } = useFieldArray({
    control,
    name: "poll.options",
  });

  const onSubmit = async (data: FormValues) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_EXPRESS_API_URL as string}/polls/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          user,
          question: data.poll.question,
          options: data.poll.options,
        }),
      },
    )
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
      });
    reset(); // Reset the form after submission
    modalRef.current?.close(); // Close the modal after submission
    await revalidatePage("/polls"); // Replace with your page path
  };

  return (
    <div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn btn-outline btn-primary fixed top-28 right-5"
        onClick={() => modalRef.current?.showModal()}
      >
        Create a poll
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="h-150 max-w-5xl p-5 border border-base-content rounded-xl mx-auto bg-white/30 bg-cover bg-[url(/hexagon-background.webp)]"
          >
            <div className="backdrop-blur-xs bg-black/30 p-5 max-h-135 shadow-sm shadow-white/70 rounded-xl overflow-auto">
              <div className="mb-5">
                <label className="block mb-2 text-xl font-medium text-base-content">
                  Poll
                </label>
                <textarea
                  {...register("poll.question")}
                  className="w-full textarea textarea-secondary"
                  placeholder="Enter your question"
                ></textarea>
                {errors.poll?.question && (
                  <p className="mt-2 text-red-300">
                    {errors.poll.question.message}
                  </p>
                )}
              </div>
              <div className="mb-2 space-y-4">
                {pollOptions.map((option, index) => (
                  <div key={option.id}>
                    <div className="flex items-center gap-2">
                      <input
                        {...register(`poll.options.${index}.answer`)}
                        placeholder={`Option ${index + 1}`}
                        className="input w-full input-primary"
                      />

                      {pollOptions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePollOption(index)}
                          className="text-red-500 cursor-pointer p-1"
                        >
                          <MdDelete className="text-red-300" size="1.25rem" />
                        </button>
                      )}
                    </div>
                    {errors.poll?.options?.[index]?.answer && (
                      <p className="text-red-300">
                        {errors.poll.options[index].answer.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div>
                {pollOptions.length < 8 ? (
                  <button
                    type="button"
                    onClick={() => appendPollOption({ answer: "" })}
                    className="pr-4 py-2 flex items-center gap-1 cursor-pointer"
                  >
                    <MdAdd />
                    Add Option
                  </button>
                ) : (
                  <p className="text-red-500">Maximum of 8 options reached</p>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-success bg-emerald-500 text-slate-100 mt-4"
              >
                Submit Poll
              </button>
            </div>
          </form>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-error">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CreatePoll;
