"use client";
import React, { useState } from "react";

const FeatureToggle = ({
  show,
  setShow,
  postId,
  feature,
}: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
  feature: string;
}) => {
  const [loading, setLoading] = useState(false);

  const handleToggleFeature = (postId: string, toggle: boolean) => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/posts/toggle/${feature}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
        },
        body: JSON.stringify({ postId, value: toggle }), // Use the passed toggle value
      },
    )
      .then((res) => res.json())
      .then((result) => {
        setShow(result.toggle[feature]);
        setLoading(false);
      });
  };
  return (
    <li>
      <button
        onClick={() => handleToggleFeature(postId, !show)}
        className="p-2 text-xs rounded-lg text-base-300 font-semibold hover:bg-base-300 hover:text-white transition-colors duration-200"
      >
        {show ? (
          <>
            Hide {feature} <Loading loading={loading} />
          </>
        ) : (
          <>
            Show {feature} <Loading loading={loading} />
          </>
        )}
      </button>
    </li>
  );
};

const Loading = ({ loading }: { loading: boolean }) => {
  return (
    loading && (
      <span className="inline-block size-5 rounded-full animate-spin border border-base-300 border-t-0"></span>
    )
  );
};

export default FeatureToggle;
