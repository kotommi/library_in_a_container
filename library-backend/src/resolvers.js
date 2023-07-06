const { GraphQLError } = require("graphql")
const { PubSub } = require("graphql-subscriptions")
const Author = require("./schemas/Author");
const Book = require("./schemas/Book");
const User = require("./schemas/User");
const jwt = require("jsonwebtoken")

const pubsub = new PubSub();

const resolvers = {
    Query: {
        me: (root, args, context) => context.currentUser,
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            const findParams = {};
            if (args.genre) {
                findParams.genres = args.genre;
            }
            const books = await Book.find(findParams).populate("author").exec();
            return books;
        },
        allAuthors: async () => Author.find({})
    },
    Author: {
        bookCount: async (root) => {
            const books = await Book.find({ author: root._id });
            return books.length
        }
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
        }
    },
    Mutation: {
        addBook: async (_root, args, context) => {
            const currentUser = context.currentUser
            if (!currentUser) {
                throw new GraphQLError("not authenticated", {
                    extensions: {
                        code: "BAD_USER_INPUT"
                    }
                })
            }
            let author = await Author.findOne({ name: args.author });
            if (!author) {
                author = new Author({ name: args.author, born: null });
                try {
                    await author.save();
                } catch (error) {
                    throw new GraphQLError("Saving new author failed", {
                        extensions: {
                            code: "BAD_USER_INPUT",
                            invalidArgs: args.author,
                            error
                        }
                    })
                }
            }
            const book = new Book({ ...args, author: author._id })
            try {
                await book.save()
            } catch (error) {
                throw new GraphQLError("Saving book failed", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args,
                        error
                    }
                })
            }
            const addedBook = await book.populate("author")
            pubsub.publish("BOOK_ADDED", { bookAdded: addedBook });
            return addedBook
        },
        editAuthor: async (root, args, context) => {
            const currentUser = context.currentUser
            if (!currentUser) {
                throw new GraphQLError("not authenticated", {
                    extensions: {
                        code: "BAD_USER_INPUT"
                    }
                })
            }
            const author = await Author.findOne({ name: args.name });
            if (!author) {
                return null
            }
            author.born = args.setBornTo
            await author.save()
            return author
        },
        createUser: async (root, args) => {
            const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
            return user.save().catch(error => {
                throw new GraphQLError("Creating the user failed", {
                    extensions: { code: "BAD_USER_INPUT", invalidArgs: args.name, error }
                })
            })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username });
            if (!user || args.password !== "secret") {
                throw new GraphQLError("wrong credentials", {
                    extensions: {
                        code: "BAD_USER_INPUT"
                    }
                })
            }
            const userForToken = {
                username: user.username,
                id: user._id
            };
            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        }
    }

}

module.exports = resolvers;