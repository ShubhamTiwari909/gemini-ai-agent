import React from "react";

const Loading = () => {
  return (
    <section className="min-h-screen px-5 py-0 mx-auto max-w-7xl lg:px-0 pt-10">
      {/* <div>
        <h1 className="text-6xl md:text-7xl font-bold flex items-center">
          L
          <svg
            className="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Capa_1"
            x="0px"
            y="0px"
            viewBox="0 0 455 455"
            xmlSpace="preserve"
            width="72"
            height="72"
          >
            <g>
              <path
                style={{ fill: "#185F8D" }}
                d="M443.435,299.28c7.5-22.57,11.565-46.7,11.565-71.78c0-25.75-4.285-50.5-12.165-73.58l-45.58-77.865   c-32.37-36.26-76.165-62.08-125.745-71.79h-88.02c-49.58,9.71-93.385,35.53-125.755,71.79l-45.57,77.865   C4.285,177,0,201.75,0,227.5c0,25.08,4.065,49.22,11.565,71.79l43.685,76.83c32.59,37.74,77.38,64.655,128.24,74.615h88.02   c50.86-9.97,95.64-36.875,128.23-74.615L443.435,299.28z"
              />
              <path
                style={{ fill: "#98D9D5" }}
                d="M400.41,227.5L314.323,76.65L271.51,4.265C257.27,1.465,242.55,0,227.49,0   c-15.05,0-29.77,1.465-44,4.265L140.677,76.65L54.59,227.5c0,0-43.02,71.79-43.03,71.79c9.48,28.54,24.46,54.57,43.69,76.83   l85.53,0.885h173.44l85.52-0.885c19.24-22.26,34.215-48.3,43.695-76.84L400.41,227.5z"
              />
              <path
                style={{ fill: "#C1E8E6" }}
                d="M397.25,76.06l-82.927,0.59l-43.883,75.84h-85.88l-43.883-75.84l-82.942-0.595   c-20.01,22.41-35.65,48.815-45.57,77.865L54.59,227.5h86.19l43.78,75.01l-43.78,74.495l42.71,73.725c14.23,2.81,28.95,4.27,44,4.27   c15.06,0,29.78-1.465,44.02-4.265l42.71-73.73l-43.78-74.495l43.78-75.01h86.19c0,0,42.42-73.58,42.43-73.58   C432.91,124.87,417.27,98.46,397.25,76.06z"
              />
              <polygon
                style={{ fill: "#185F8D" }}
                points="270.44,152.49 184.56,152.49 140.78,227.5 184.56,302.51 270.44,302.51 314.22,227.5  "
              />
              <circle
                style={{ fill: "#6DA8D6" }}
                cx="342.16"
                cy="286.285"
                r="7.5"
              />
              <circle
                style={{ fill: "#6DA8D6" }}
                cx="372.16"
                cy="316.285"
                r="7.5"
              />
              <circle
                style={{ fill: "#6DA8D6" }}
                cx="82.84"
                cy="138.715"
                r="7.5"
              />
            </g>
          </svg>
          ading . . .
        </h1>
      </div> */}
      <div>
        <div className="skeleton h-20 lg:h-15 w-full mb-10"></div>
        <div className="skeleton h-57 w-full mb-6 lg:mb-10"></div>
        <div className="flex flex-wrap gap-5 items-center justify-center lg:gap-10">
          <div className="skeleton h-12 w-39 mb-6 lg:mb-10"></div>
          <div className="skeleton h-12 w-39 mb-6 lg:mb-10"></div>
          <div className="skeleton h-34 w-87 mb-6 lg:mb-10"></div>
        </div>
        <div className="skeleton z-30 left-2 top-36 w-11 h-8 lg:w-15 lg:h-10 hidden lg:fixed"></div>
      </div>
    </section>
  );
};

export default Loading;
