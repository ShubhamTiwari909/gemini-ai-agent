import React from "react";

const Heading = ({
  prompt,
  className,
}: {
  prompt: string;
  className?: string;
}) => {
  return (
    <h2 className={className}>
      {prompt?.slice(0, prompt?.indexOf("- Generate the entire response in"))}
    </h2>
  );
};

export default Heading;
