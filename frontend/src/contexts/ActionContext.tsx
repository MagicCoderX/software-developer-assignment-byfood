import React, { createContext, useState, useContext, ReactNode } from "react";

type TModalAction = {
  type: "add" | "update";
  id?: number;
};

interface IActionContext {
  action: TModalAction;
  setAction: (state: TModalAction) => void;
}

const ActionContext = createContext<IActionContext | undefined>(undefined);

export const ActionProvider = ({ children }: { children: ReactNode }) => {
  const [action, setAction] = useState<TModalAction>({ type: "add" });

  return (
    <ActionContext.Provider value={{ action, setAction }}>
      {children}
    </ActionContext.Provider>
  );
};

export const useAction = () => {
  const context = useContext(ActionContext);
  if (context === undefined) {
    throw new Error("useAction must be used within a ActionProvider");
  }
  return context;
};
