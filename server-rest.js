import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import { Book } from "./models/Book.js";

dotenv.config();
const app = express();

app.use(express.json());

// GET /books?author=&genre=
app.get("/books", async (req, res) => {
	try {
		const { author, genre } = req.query;
		const filter = {};
		if (author) filter.author = new RegExp(author, "i");
		if (genre) filter.genre = new RegExp(genre, "i");
		const books = await Book.find(filter).lean();
		res.json(books);
	} catch (e) {
		res.status(500).json({ error: "Failed to fetch books" });
	}
});

// GET /books/:id
app.get("/books/:id", async (req, res) => {
	try {
		const doc = await Book.findById(req.params.id).lean();
		if (!doc) return res.status(404).json({ error: "Not found" });
		res.json(doc);
	} catch {
		res.status(400).json({ error: "Invalid id" });
	}
});

// POST /books  { title, author, genre }
app.post("/books", async (req, res) => {
	try {
		const { title, author, genre } = req.body;
		if (!title || !author) {
			return res.status(400).json({ error: "title and author are required" });
		}
		const created = await Book.create({ title, author, genre });
		res.status(201).json(created);
	} catch (e) {
		res.status(500).json({ error: "Failed to create book" });
	}
});

const PORT = process.env.PORT || 3000;

connectDB()
	.then(() =>
		app.listen(PORT, () => console.log(`REST on http://localhost:${PORT}`))
	)
	.catch(console.error);
