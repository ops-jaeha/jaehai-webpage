"use client";

import React from "react";
import TopNav from "../components/TopNav";
import { DarkModeProvider } from "../components/DarkModeContext";

function ClientLayout({ children }) {
  return (
    <DarkModeProvider>
      <TopNav />
      {children}
    </DarkModeProvider>
  );
}

export default ClientLayout;
