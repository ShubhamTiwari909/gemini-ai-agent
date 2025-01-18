"use client";
import React, { useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type History = {
  historyId: string;
  email: string;
  prompt: string;
  response: string;
}[];

const HistoryWrapper = ({
  email,
  expressUrl,
}: {
  email: string | null | undefined;
  expressUrl: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [history, setHistory] = React.useState<History>([]);
  useEffect(() => {
    fetch(`${expressUrl}/history/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setHistory(data);
      })
      .catch((error) => {
        console.error("Error fetching history:", error);
      });
  }, []);
  return (
    <div
      className={`fixed left-0 top-20 lg:top-32 lg:max-w-96 ${isOpen ? "w-full" : "w-0"}`}
    >
      {!isOpen ? (
        <button
          className="absolute z-30 btn btn-info left-5"
          onClick={() => setIsOpen(true)}
        >
          <FaArrowRight />
        </button>
      ) : null}
      <div
        className={`h-[500px] bg-base-300 rounded-xl transition-all duration-150 ease-in-out p-5 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          className="absolute z-30 btn btn-info right-5"
          onClick={() => setIsOpen(false)}
        >
          <FaArrowLeft />
        </button>
        <ul className="h-full py-5 overflow-auto">
          {history.map((item, index) => {
            return (
              <li key={index}>
                <p>{item.prompt}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default HistoryWrapper;
