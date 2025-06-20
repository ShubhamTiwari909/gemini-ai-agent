import React, { useEffect } from "react";

import { themeChange } from "theme-change";

export const daisyUIThemes = [
  "business",
  "dark",
  "night",
  "synthwave",
  "halloween",
  "aqua",
  "black",
  "luxury",
  "coffee",
];

const ThemeChanger = ({ closeModal }: { closeModal: () => void }) => {
  const [selected, setSelected] = React.useState<string | null>("");
  useEffect(() => {
    themeChange(false);
    setSelected(localStorage.getItem("theme") || "synthwave");
    // 👆 false parameter is required for react project
  }, []);
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {daisyUIThemes.map((theme) => (
        <div key={theme}>
          <label className="flex justify-between label cursor-pointer">
            <span className="label-text">{theme}</span>
            <input
              type="radio"
              name="theme-radios"
              className="radio theme-controller"
              data-set-theme={theme}
              value={theme}
              onClick={closeModal}
              onChange={(e) => setSelected(e.target.value)}
              checked={selected === theme}
            />
          </label>
        </div>
      ))}
    </section>
  );
};

export default ThemeChanger;
