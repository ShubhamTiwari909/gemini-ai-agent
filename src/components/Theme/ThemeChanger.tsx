import React from "react";
import { daisyUIThemes } from "../../../tailwind.config";

const ThemeChanger = ({ closeModal }: { closeModal: () => void }) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {daisyUIThemes.map((theme) => (
        <div className="form-control" key={theme}>
          <label className="label cursor-pointer gap-4">
            <span className="label-text">{theme}</span>
            <input
              type="radio"
              name="theme-radios"
              className="radio theme-controller"
              value={theme}
              onClick={closeModal}
            />
          </label>
        </div>
      ))}
    </section>
  );
};

export default ThemeChanger;
