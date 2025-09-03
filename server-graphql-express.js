//npm i express dotenv mongoose
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import { Book } from "./models/Book.js";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

dotenv.config();

const app = express();

app.use(express.json());

const typeDefs = /* GraphQL */`
    type Book {
        id: ID!,
        title: String!,
        author: String!,
        genre: String!,
    }

    type Query {
        books(author: String, genre:String): [Book!]!
        book(id:ID!): Book
    }

`
// GET /books?author=Astrid
const apollo = new ApolloServer{/*typedefs och resolvers*/}

app.use("/graphql", expressMiddleware(apollo, {
    context: async () => ({}),
}))

app.get("/books", async (req, res) => {
	try {
		const books = await Book.find();
		res.json(books);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch books" });
	}
});
/* 
app.get("/books/:id", async (req, res) => {

	try {
		const books = await Book.findById(id);
		res.json(books);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch books" });
	}
}); */

app.post("/books", async (req, res) => {
	try {
		const { title, author, genre } = req.body;
		if (!title || !author || !genre) {
			return res.status(400).json({ error: "Title and author is required" });
		}
		const createdBook = await Book.create({ title, author, genre });
		res.status(201).json(createdBook);
	} catch (error) {}
});

const PORT = 3000;

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log("Rest is running on port 3000");
		});
	})
	.catch(console.error);
