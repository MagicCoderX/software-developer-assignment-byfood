import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useRouter as useNavigation } from "next/navigation";

export default function Page() {
  const {
    query: { slug },
  } = useRouter();

  const router = useNavigation();

  const { data: book, isFetching: fetching } = useQuery({
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/api/books/${slug}`);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    queryKey: ["book", slug],
  });

  if (!book) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <header className="header">
        <h1 className="header__h1">Book Details</h1>
        <button
          className="btn btn__primary btn__icon"
          onClick={() => {
            router.push("/");
          }}
        >
          <span>Go to book lists</span>
        </button>
      </header>

      <div className="flex flex-col gap-3 p-4 m-4">
        <div className="flex flex-col gap-8">
          {Object.keys(book).map((key) => {
            if (key === "id") return null;
            return (
              <div key={key} className="flex gap-4 items-end">
                <span className="text-gray-400 text-[16px]">{key}: </span>
                <span className=" text-[20px]">{book[key]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
