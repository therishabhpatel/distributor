import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import HeaderDataCards from "../components/HeaderDataCards";

const DistributorHomepage = () => {
  return (
    <main className="flex">
      {/* sidebar compo */}
      <aside className="w-1/4">
        <Sidebar />
      </aside>

      <section className="w-full p-4 bg-[var(--main-bg)] flex flex-col gap-2">
        <Header />
        <HeaderDataCards />
        <Outlet />
      </section>
    </main>
  );
};

export default DistributorHomepage;
