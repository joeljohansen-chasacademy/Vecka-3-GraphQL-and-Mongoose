import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
	await mongoose.connect(process.env.MONGODB_URI, {
		dbName: "exampleBookstore",
	});
	console.log("Connected to database");
}
