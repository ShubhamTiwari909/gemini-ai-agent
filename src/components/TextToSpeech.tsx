import React, { useState, useEffect, JSX } from "react";
import { GiSpeaker, GiSpeakerOff } from "react-icons/gi";
import { PiSpeakerSlashFill } from "react-icons/pi";

/**
 * A component that provides a text-to-speech interface.
 *
 * @param {{ text: string }} props The text to be spoken.
 * @returns {JSX.Element} A div containing three buttons: Play, Pause, and Stop.
 */
const TextToSpeech = ({ text }: { text: string }): JSX.Element => {
  const [isPaused, setIsPaused] = useState(true);
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
    console.log(isPaused);

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
    <div className="absolute lg:right-8 lg:top-12 right-0 -top-7 flex items-center gap-x-5 p-2.5 bg-white rounded-xl">
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
