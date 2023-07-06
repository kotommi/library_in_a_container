import { useQuery } from "@apollo/client";
import { FILTER_BOOKS } from "../queries";
import BookTable from "./BookTable";


const Recommend = ({ show, user, books }) => {

    const { loading, data } = useQuery(FILTER_BOOKS, {
        variables: {
            genre: user?.favoriteGenre
        }
    });

    const booksToShow = loading ? [] : data.allBooks;

    if (!show || !user) return null;

    return (
        <div>
            <h3>Recommendations</h3>
            <p>Books in your favorite genre {user.favoriteGenre}</p>
            <BookTable books={booksToShow} />
        </div>
    )

}

export default Recommend;