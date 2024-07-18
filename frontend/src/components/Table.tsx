"use client";
import * as React from "react";
import { EyeSVG, PencilSVG, TrashSVG } from "../icons";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/contexts/QueryClient";
import { useModal } from "@/contexts/ModalContext";
import { useAction } from "@/contexts/ActionContext";
import { useRouter } from "next/navigation";

const Table: React.FC = () => {
  const router = useRouter();
  const { openModal, setOpenModal } = useModal();
  const { setAction } = useAction();
  const { data: books, isLoading } = useQuery({
    queryFn: async () => {
      const response = await fetch("http://localhost:8080/api/books");
      return response.json();
    },
    queryKey: ["books"],
  });

  const { mutateAsync: deleteBook, isPending: deleting } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`http://localhost:8080/api/books/${id}`, {
        method: "DELETE",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  return (
    <div>
      <table className="table">
        <thead className="table__head">
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Author</th>
            <th>Year of publication</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody className="table__body">
          {isLoading && (
            <tr>
              <td className="text-center">Loading...</td>
            </tr>
          )}
          {books?.length === 0 && (
            <tr>
              <td>No Books Found.</td>
            </tr>
          )}
          {books?.map((book: any) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.type}</td>
              <td>{book.author}</td>
              <td>{book.year}</td>
              <td>
                <button
                  className="btn btn__compact btn__view"
                  onClick={() => {
                    router.push(`/book/${book.id}`);
                  }}
                >
                  <EyeSVG />
                </button>
                <button
                  className="btn btn__compact btn__edit"
                  onClick={() => {
                    setAction({ type: "update", id: book.id });
                    setOpenModal(!openModal);
                  }}
                >
                  <PencilSVG />
                </button>
                <button
                  className="btn btn__compact btn__delete"
                  onClick={() => {
                    deleteBook(book.id);
                  }}
                >
                  <TrashSVG />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
