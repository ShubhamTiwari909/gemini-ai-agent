import React from "react";
import ThemeModal from "../../components/Theme/Modal";

const page = () => {
  return (
    <section className="min-h-[calc(100vh-64px)] px-5 relative pt-10 lg:px-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-4">Manage your account settings here.</p>
      </div>

      <div>
        <ThemeModal />
      </div>
    </section>
  );
};

export default page;
