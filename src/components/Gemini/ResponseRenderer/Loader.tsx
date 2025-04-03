import { LoaderProps } from "@/types/utils";
import React from "react";

const Loader = ({ loading, summary }: LoaderProps) => {
  return (
    loading &&
    summary && (
      <div className="absolute inset-0 bg-slate-900/30 lg:grid lg:place-items-center h-full">
        <p className="text-2xl lg:text-4xl font-bold text-center text-slate-100 pt-20">
          Refreshing content...
        </p>
      </div>
    )
  );
};

export default Loader;
