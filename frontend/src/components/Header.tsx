import * as React from "react";
import { BookAddSVG } from "../icons";
import { useAction } from "@/contexts/ActionContext";
import { useModal } from "@/contexts/ModalContext";

export interface IAppProps {}

const Header: React.FC<IAppProps> = () => {
  const { openModal, setOpenModal } = useModal();
  const { setAction } = useAction();

  return (
    <header className="header">
      <h1 className="header__h1">
        Manage <span>Books</span>
      </h1>
      <button
        className="btn btn__primary btn__icon"
        onClick={() => {
          setAction({ type: "add", id: undefined });
          setOpenModal(!openModal);
        }}
      >
        <BookAddSVG /> <span>Add new</span>
      </button>
    </header>
  );
};

export default Header;
