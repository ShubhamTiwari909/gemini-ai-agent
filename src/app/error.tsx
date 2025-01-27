"use client";
import React from "react";

const error = async ({ error }: { error: Error }) => {
  return (
    <div>
      <p>{error.message}</p>
    </div>
  );
};

export default error;
