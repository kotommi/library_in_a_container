const typeDefs = `
  type Subscription {
    bookAdded: Book!
  }

  type Book {
    title: String!
    author: Author!
    id: ID!
    published: Int
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    me: User
    bookCount: Int!
    authorCount:Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook (
        title: String!,
        author: String!,
        published: Int,
        genres: [String!]!
    ): Book
    editAuthor (
        name: String!,
        setBornTo: Int!
    ): Author
    createUser(
        username: String!
        favoriteGenre: String!
      ): User
      login(
        username: String!
        password: String!
      ): Token
  }
`;

module.exports = typeDefs;