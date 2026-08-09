/**
 * Represents the different lexical elements
 * that can be identified by the StoryLang lexer
 */
export enum TokenType {
	// Structural Tokens
	NEWLINE = "NEWLINE",
	EOF = "EOF",

	// Symbols
	COLON = "COLON",
	HASH = "HASH",
	AT = "AT",

	// Textual Tokens
	IDENTIFIER = "IDENTIFIER",
	TEXT = "TEXT",

	// Comments
	COMMENT = "COMMENT",
	UNKNOWN = "UNKNOWN",
}
