import { Lexer } from "../src/core/lexer/Lexer.js";

const source = `title: The Last City
	author: Aryan
	genre: Fantasy

	# Chapter 1

	@scene

	The rain never stopped.

	Alice:
	We shouldn't be here.

	Bob:
	We came too far to turn back.

	// This is a comment

	Lightning flashed across the sky.
`;

const lexer = new Lexer(source);
const tokens = lexer.tokenize();

for (const token of tokens) {
	console.log(
		`${token.position.line}:${token.position.column}`,
		token.type,
		JSON.stringify(token.value),
	);
}
