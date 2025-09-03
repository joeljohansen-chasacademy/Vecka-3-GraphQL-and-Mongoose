import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		author: { type: String, required: true, trim: true },
		genre: { type: String, required: true, trim: true },
	},
	{ timestamps: true, collection: "exampleBooks" }
);

export const Book = mongoose.model("Book", bookSchema);
