import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import { useApolloClient, useQuery, useSubscription } from "@apollo/client"

import { ALL_BOOKS, ALL_AUTHORS, GET_USER, BOOK_ADDED, FILTER_BOOKS } from './queries'
import Recommend from './components/Recommend'



const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState('authors');
  const client = useApolloClient();
  const authors = useQuery(ALL_AUTHORS);
  const books = useQuery(ALL_BOOKS);
  const meQuery = useQuery(GET_USER);
  const allauthors = authors.loading ? [] : authors.data.allAuthors;
  const allbooks = books.loading ? [] : books.data.allBooks;
  const user = meQuery.loading ? null : meQuery.data.me;

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data?.data?.bookAdded
      window.alert(`New book ${addedBook.title} was added`)
      // allBooks is the query name in the apollo stuff, has to be used for FILTER_BOOKS too
      client.cache.updateQuery({ query: FILTER_BOOKS, variables: { genre: null } }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook)
        }
      })
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook)
        }
      })
    }
  });

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage("login");
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? <button onClick={() => setPage('add')}>add book</button> : null}
        {token ? <button onClick={() => setPage("recommend")}>recommendations</button> : null}
        {!token ? <button onClick={() => setPage('login')}>login</button> : <button onClick={() => handleLogout} >logout</button>}
      </div>

      <Authors show={page === 'authors'} authors={allauthors} />

      <Books show={page === 'books'} books={allbooks} />

      <NewBook show={page === 'add'} />

      <Recommend show={page === "recommend"} user={user} />

      <Login show={page === 'login'} setToken={setToken} setPage={setPage} />


    </div>
  )
}

export default App
