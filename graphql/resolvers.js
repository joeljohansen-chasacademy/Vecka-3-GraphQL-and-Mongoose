import { Book } from "../models/Book.js";

export const resolvers = {
	Query: {
		books: async (_parent, args) => {
			const filter = {};
			if (args.author) filter.author = new RegExp(args.author, "i");
			if (args.genre) filter.genre = new RegExp(args.genre, "i");
			return Book.find(filter).lean();
		},
		book: async (_parent, { id }) => Book.findById(id).lean(),
	},
	Mutation: {
		createBook: async (_parent, { input }) => {
			//Hade glömt att göra en return här..
			return Book.create(input);
		},
	},
	//Om vi använder .lean() när vi returnerar våra objekt så får vi tillbaka ett vanligt js-objekt
	//från mongoose där variablen _id står som just detta.
	//Om vi inte använder .lean() så får vi tillbaka ett Mongoose-dokument med en .id getter som
	// ju mappar väl mot vår typedef id.

	//Så om man använder .lean() behöver vi berätta detta för GraphQL genom att säga att
	//id: (doc) => doc._id.toString(),
	//En adapter för att mappa vår typedefs "id" till mongoose och mongodbs _id.
	Book: {
		id: (doc) => doc._id.toString(),
	},
};
