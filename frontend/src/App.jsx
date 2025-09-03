import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useState } from "react";

const BOOKS = gql`
	query Books($author: String, $genre: String) {
		books(author: $author, genre: $genre) {
			id
			title
			author
			genre
		}
	}
`;

const ADD_BOOK = gql`
	mutation Add($input: CreateBookInput!) {
		createBook(input: $input) {
			id
			title
			author
			genre
		}
	}
`;

export default function App() {
	const [filters, setFilters] = useState({ author: "", genre: "" });
	const { data, loading, error, refetch } = useQuery(BOOKS, {
		variables: { author: filters.author || null, genre: filters.genre || null },
	});

	const [addBook, { loading: adding }] = useMutation(ADD_BOOK, {
		onCompleted: () => refetch(),
	});

	const [form, setForm] = useState({ title: "", author: "", genre: "" });

	return (
		<div style={{ fontFamily: "system-ui", padding: 24 }}>
			<h1>Books (GraphQL)</h1>

			<div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
				<input
					placeholder="filter author"
					value={filters.author}
					onChange={(e) =>
						setFilters((f) => ({ ...f, author: e.target.value }))
					}
				/>
				<input
					placeholder="filter genre"
					value={filters.genre}
					onChange={(e) => setFilters((f) => ({ ...f, genre: e.target.value }))}
				/>
				<button onClick={() => refetch()}>Refresh</button>
			</div>

			<div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
				<input
					placeholder="title"
					value={form.title}
					onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
				/>
				<input
					placeholder="author"
					value={form.author}
					onChange={(e) => setForm((s) => ({ ...s, author: e.target.value }))}
				/>
				<input
					placeholder="genre"
					value={form.genre}
					onChange={(e) => setForm((s) => ({ ...s, genre: e.target.value }))}
				/>
				<button
					disabled={adding}
					onClick={() => {
						addBook({
							variables: { input: { ...form, genre: form.genre || null } },
						});
						setForm({ title: "", author: "", genre: "" });
					}}
				>
					{adding ? "Adding..." : "Add"}
				</button>
			</div>

			{loading && <p>Loading…</p>}
			{error && (
				<pre style={{ background: "#f6f6f6", padding: 8 }}>{error.message}</pre>
			)}

			<ul>
				{(data?.books || []).map((b) => (
					<li key={b.id}>
						<strong>{b.title}</strong> — {b.author} ({b.genre || "–"})
					</li>
				))}
			</ul>
		</div>
	);
}
