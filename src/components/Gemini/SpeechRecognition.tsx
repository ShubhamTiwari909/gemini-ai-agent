"use client";
import "regenerator-runtime/runtime";
import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useGlobalStore } from "@/store/global-store";

const SpeechRecognitionUI = ({
  stopSpeech,
  className,
}: {
  stopSpeech: () => void;
  className?: string;
}) => {
  const { transcript, listening } = useSpeechRecognition();
  const loading = useGlobalStore((state) => state.loading);
  const setInputText = useGlobalStore((state) => state.setInputText);
  useEffect(() => {
    setInputText(transcript);
  }, [transcript]);

  return (
    <div
      className={`flex items-center gap-x-5 absolute z-10 right-3 bottom-8 lg:bottom-[unset] lg:right-5 lg:top-5 bg-base-300 py-2.5 px-4 rounded-2xl ${className}`}
    >
      <button
        className="cursor-pointer disabled:cursor-not-allowed"
        onClick={() => {
          stopSpeech();
          SpeechRecognition.startListening();
        }}
        disabled={loading}
      >
        {listening ? (
          <FaMicrophone color="lime" size="1rem" />
        ) : (
          <FaMicrophone color="grey" size="1rem" />
        )}
      </button>

      <button
        className="cursor-pointer disabled:cursor-not-allowed"
        onClick={() => {
          stopSpeech();
          SpeechRecognition.stopListening();
        }}
        disabled={loading}
      >
        <FaMicrophoneSlash color="red" size="1rem" />
      </button>
    </div>
  );
};

export default SpeechRecognitionUI;
