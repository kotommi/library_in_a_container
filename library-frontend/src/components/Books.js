import { useState } from "react";
import BookTable from "./BookTable";
import { useQuery } from "@apollo/client";
import { FILTER_BOOKS } from "../queries";

const Books = (props) => {
  const [filter, setFilter] = useState(null);

  const { data, loading } = useQuery(FILTER_BOOKS, { variables: { genre: filter } })

  const filteredBooks = loading ? [] : data.allBooks;

  if (!props.show) {
    return null
  }

  const allGenres = new Set();
  props.books.forEach(b => b.genres?.forEach(g => allGenres.add(g)));
  const genreList = Array.from(allGenres)

  return (
    <div>
      <h2>books</h2>
      <BookTable books={filteredBooks} />
      <div>
        <button key={"all"} onClick={() => setFilter(null)}>Show all</button>
        {genreList.map(g => <button key={g} onClick={() => setFilter(g)}>{g}</button>)}
      </div>
    </div>
  )
}

export default Books
