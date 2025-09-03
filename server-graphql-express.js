//npm i express dotenv mongoose
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import { Book } from "./models/Book.js";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { typedefs } from "./graphql/typedefs.js";
import { resolvers } from "./graphql/resolvers.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const apollo = new ApolloServer({ typedefs, resolvers });
await apollo.start();

app.use(
	"/graphql",
	expressMiddleware(apollo, {
		context: async () => ({}),
	})
);

app.get("/books", async (req, res) => {
	try {
		const books = await Book.find();
		res.json(books);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch books" });
	}
});

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
