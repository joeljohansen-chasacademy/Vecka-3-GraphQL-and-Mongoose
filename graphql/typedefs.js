export const typeDefs = /* GraphQL */ `
	type Book {
		id: ID!
		author: String!
		title: String!
		genre: String!
	}

	type Query {
		books(author: String, genre: String): [Book!]!
		book(id: ID!): Book
	}

	input CreateBookInput {
		title: String!
		author: String!
		genre: String!
	}

	type Mutation {
		createBook(input: CreateBookInput!): Book!
	}
`;
