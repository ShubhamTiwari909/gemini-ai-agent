import { useGlobalStore } from "@/store/global-store";
import React, { useState, useEffect, JSX } from "react";
import { GiSpeaker, GiSpeakerOff } from "react-icons/gi";
import { PiSpeakerSlashFill } from "react-icons/pi";

/**
 * A component that provides a text-to-speech interface.
 *
 * @param {{ text: string }} props The text to be spoken.
 * @returns {JSX.Element} A div containing three buttons: Play, Pause, and Stop.
 */
const TextToSpeech = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}): JSX.Element => {
  // const [isPaused, setIsPaused] = useState(true);
  const isPaused = useGlobalStore((state) => state.isSpeechPaused);
  const setIsPaused = useGlobalStore((state) => state.setIsSpeechPaused);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null,
  );

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);

    u.onend = () => {
      setIsPaused(true);
    };

    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, [text]);

  const handlePlayPause = () => {
    const synth = window.speechSynthesis;

    if (isPaused) {
      setIsPaused(false);
      synth.resume();
      synth.speak(utterance as SpeechSynthesisUtterance);
    } else {
      synth.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPaused(true);
  };

  return (
    <div
      className={`w-fit flex justify-center items-center gap-x-5 p-2.5 bg-white rounded-xl ${className}`}
    >
      <button onClick={handlePlayPause}>
        {isPaused ? (
          <GiSpeaker className="text-green-500" size="1.75rem" />
        ) : (
          <GiSpeakerOff className="text-red-500" size="1.75rem" />
        )}
      </button>
      <button onClick={handleStop}>
        <PiSpeakerSlashFill className="text-red-700" size="1.4rem" />
      </button>
    </div>
  );
};

export default TextToSpeech;
