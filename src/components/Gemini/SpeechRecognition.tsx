"use client";
import "regenerator-runtime/runtime";
import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const SpeechRecognitionUI = ({
  setInput,
  loading,
  stopSpeech,
}: {
  setInput: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  stopSpeech: () => void;
}) => {
  const { transcript, listening } = useSpeechRecognition();

  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  return (
    <div className="flex items-center gap-x-5 absolute right-3 top-72 lg:right-5 lg:top-5 bg-base-300 p-2.5 rounded-2xl">
      <button
        className="cursor-pointer"
        onClick={() => {
          stopSpeech();
          SpeechRecognition.startListening();
        }}
        disabled={loading}
      >
        {listening ? (
          <FaMicrophone color="lime" size="1.4rem" />
        ) : (
          <FaMicrophone color="grey" size="1.4rem" />
        )}
      </button>

      <button
        className="cursor-pointer"
        onClick={() => {
          stopSpeech();
          SpeechRecognition.stopListening();
        }}
        disabled={loading}
      >
        <FaMicrophoneSlash color="red" size="1.4rem" />
      </button>
    </div>
  );
};

export default SpeechRecognitionUI;
