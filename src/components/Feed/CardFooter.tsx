import { formatDate } from "@/lib/utils";
import React from "react";

const CardFooter = ({
  createdAt,
  className,
}: {
  createdAt: string;
  className?: string;
}) => {
  return (
    <div
      className={`flex flex-wrap gap-y-5 justify-between items-center font-bold ${className}`}
    >
      <p className="text-xs">{formatDate(createdAt as string)}</p>
    </div>
  );
};

export default CardFooter;
