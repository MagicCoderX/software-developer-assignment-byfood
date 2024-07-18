import * as React from "react";
import Head from "next/head";
import { ActionProvider } from "@/contexts/ActionContext";
import { ModalProvider } from "@/contexts/ModalContext";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  return (
    <ModalProvider>
      <ActionProvider>
        <main className="layout">
          <Head>
            <title>byFood_assignment</title>
          </Head>
          {children}
        </main>
      </ActionProvider>
    </ModalProvider>
  );
};

export default Layout;
