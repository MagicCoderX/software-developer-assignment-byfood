import * as React from "react";
import { CloseSVG } from "@/icons";
import { useModal } from "@/contexts/ModalContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/contexts/QueryClient";
import { useAction } from "@/contexts/ActionContext";

type IBook = {
  title?: string;
  type?: string;
  author?: string;
  year?: number;
  [key: string]: number | string | any;
};

const Modal: React.FC = () => {
  const { openModal, setOpenModal } = useModal();
  const {
    action: { type: modalType, id },
  } = useAction();

  const [bookData, setBookData] = React.useState<IBook>({
    title: "",
    type: "",
    author: "",
    year: new Date().getFullYear(),
  });

  const { data: book, isFetching: fetching } = useQuery({
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/api/books/${id}`);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    queryKey: ["book", id],
    enabled: modalType === "update",
  });

  React.useEffect(() => {
    if (book) setBookData(book);
  }, [book]);

  const handleAfterMutate = () => {
    setOpenModal(!openModal);
    queryClient.invalidateQueries({ queryKey: ["books"] });
  };

  const { mutateAsync: addBook, isPending: pending } = useMutation({
    mutationFn: async (book: any) => {
      const response = await fetch("http://localhost:8080/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    onSuccess: handleAfterMutate,
  });

  const { mutateAsync: updateBook, isPending: updating } = useMutation({
    mutationFn: async (book: any) => {
      const response = await fetch(`http://localhost:8080/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    onSuccess: handleAfterMutate,
  });

  const onSumbit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { title, type, author, year } = bookData;
    if (modalType === "update") {
      try {
        await updateBook({ title, type, author, year });
        setBookData({});
      } catch (error) {
        console.error(error);
      }
      return;
    }
    try {
      await addBook({ title, type, author, year });
      setBookData({});
    } catch (error) {
      console.error(error);
    }
  };

  const fields = [
    { id: "titleInput", name: "title", placeholder: "Title" },
    { id: "typeInput", name: "type", placeholder: "Type" },
    { id: "authorInput", name: "author", placeholder: "Author" },
  ];

  const capitalize = (s: any) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  if (!openModal || fetching) return null;

  return (
    <div className="modal">
      <div className="modal__content">
        <header className="header modal__header">
          <h1 className="header__h2">
            <span className="capitalize">{modalType}</span> <span>Book</span>
          </h1>
          <button
            className="btn btn__compact btn__close"
            onClick={() => setOpenModal(!openModal)}
          >
            <CloseSVG />
          </button>
        </header>

        <form className="form modal__form" onSubmit={onSumbit}>
          {fields.map(({ id, name, placeholder }) => (
            <div className="form__element" key={id}>
              <label htmlFor={id} className="label">
                {capitalize(name)}&nbsp;
                <span className="label__required">*</span>
              </label>
              <input
                type="text"
                id={id}
                name={name}
                value={bookData[name]}
                onChange={(event) =>
                  setBookData({ ...bookData, [name]: event.target.value })
                }
                placeholder={placeholder}
                className="input"
                required
              />
            </div>
          ))}

          <div className="form__element">
            <label htmlFor="yearOfPublicationInput" className="label">
              Year of publication&nbsp;
              <span className="label__required">*</span>
            </label>
            <input
              type="text"
              id="yearOfPublicationInput"
              name="yearOfPublication"
              value={bookData["year"]}
              onChange={(event) => {
                setBookData({
                  ...bookData,
                  year: parseInt(event.target.value),
                });
              }}
              placeholder="2024"
              className="input"
            />
          </div>

          <div className="form__action">
            <button
              className="btn btn__icon btn__cancel"
              type="button"
              disabled={pending}
              onClick={() => {
                setOpenModal(!openModal);
              }}
            >
              <CloseSVG /> Cancel
            </button>
            <button
              className="btn btn__primary btn__icon"
              type="submit"
              disabled={pending || updating}
            >
              {modalType === "add" ? "Add" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
