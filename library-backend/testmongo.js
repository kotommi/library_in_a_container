const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Author = require("./src/schemas/Author");
const Book = require("./src/schemas/Book");

require("dotenv").config()
const MONGODB_URI = process.env.MONGODB_URI;
console.log("connecting to", MONGODB_URI);

mongoose.connect(MONGODB_URI).then(() => {
    console.log("connected to mongodb");
}).catch((err) => {
    console.log("error connecting to mongodb", err.message)
})

const test = async () => {

    const sad = await Book.findOne({}).populate("author")
    console.log(sad);
}

test();
