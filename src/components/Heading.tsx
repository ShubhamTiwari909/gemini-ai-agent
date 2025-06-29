import React from "react";

const Heading = ({
  prompt,
  className,
}: {
  prompt: string;
  className?: string;
}) => {
  return <h2 className={className}>{prompt}</h2>;
};

export default Heading;
