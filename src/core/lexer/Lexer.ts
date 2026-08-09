import type { SourcePosition, Token } from "./Token.js";
import { TokenType } from "./TokenType.js";

export class Lexer {
	private source: string;
	private cursor: number = 0;
	private line: number = 1;
	private column: number = 1;

	/**
	 * Whether the lexer is currently at the beginning
	 * of a logical StoryLang line.
	 */
	private atLineStart: boolean = true;

	constructor(source: string) {
		this.source = source;
	}

	/**
	 * Tokenizes the complete StoryLang source.
	 */
	public tokenize(): Token[] {
		const tokens: Token[] = [];

		while (!this.isAtEnd()) {
			const token = this.nextToken();

			if (token) {
				tokens.push(token);
			}
		}

		tokens.push(this.createToken(TokenType.EOF, ""));

		return tokens;
	}

	/**
	 * Scans the next token.
	 */
	private nextToken(): Token | null {
		this.skipHorizontalWhitespace();

		if (this.isAtEnd()) {
			return null;
		}

		if (this.peek() === "\n" || this.peek() === "\r") {
			return this.scanNewline();
		}

		if (this.peek() === "/" && this.peek(1) === "/") {
			return this.scanSingleLineComment();
		}

		if (this.peek() === ":") {
			return this.consumeSingleChar(TokenType.COLON);
		}

		if (this.peek() === "#") {
			this.atLineStart = false;
			return this.consumeSingleChar(TokenType.HASH);
		}

		if (this.peek() === "@") {
			this.atLineStart = false;
			return this.consumeSingleChar(TokenType.AT);
		}

		if (this.atLineStart) {
			return this.scanLineStartToken();
		}

		return this.scanText();
	}

	/**
	 * Determines what kind of construct starts the current line.
	 *
	 * Examples:
	 *
	 * # Chapter 1
	 * @scene
	 * Alice:
	 * The rain never stopped.
	 */
	private scanLineStartToken(): Token {
		const char = this.peek();

		if (char === "#") {
			this.atLineStart = false;
			return this.consumeSingleChar(TokenType.HASH);
		}

		if (char === "@") {
			this.atLineStart = false;
			return this.consumeSingleChar(TokenType.AT);
		}

		if (this.isAlpha(char) || char === "_") {
			if (this.isLineStartIdentifier()) {
				this.atLineStart = false;
				return this.scanIdentifier();
			}

			this.atLineStart = false;
			return this.scanText();
		}

		this.atLineStart = false;
		return this.scanText();
	}

	/**
	 * Determines whether the current line begins
	 * with an identifier followed by ':'.
	 *
	 * Examples:
	 *
	 * title:
	 * Alice:
	 *
	 * return true
	 *
	 * The rain never stopped.
	 *
	 * return false
	 */
	private isLineStartIdentifier(): boolean {
		let offset = 0;

		while (!this.isAtEnd()) {
			const char = this.peek(offset);

			if (this.isAlphaNumeric(char) || char === "_" || char === "-") {
				offset++;
				continue;
			}

			break;
		}

		return this.peek(offset) === ":";
	}

	/**
	 * Scans an identifier.
	 */
	private scanIdentifier(): Token {
		const startPos = this.getPosition();
		let value = "";

		while (!this.isAtEnd()) {
			const char = this.peek();

			if (this.isAlphaNumeric(char) || char === "_" || char === "-") {
				value += this.advance();
			} else {
				break;
			}
		}

		return {
			type: TokenType.IDENTIFIER,
			value,
			position: startPos,
		};
	}

	/**
	 * Scans ordinary StoryLang text until the end
	 * of the current line.
	 */
	private scanText(): Token {
		const startPos = this.getPosition();
		let value = "";

		while (!this.isAtEnd()) {
			const char = this.peek();

			if (char === "\n" || char === "\r") {
				break;
			}

			value += this.advance();
		}

		return {
			type: TokenType.TEXT,
			value: value.trim(),
			position: startPos,
		};
	}

	/**
	 * Scans a single-line comment.
	 */
	private scanSingleLineComment(): Token {
		const startPos = this.getPosition();

		// Consume "//"
		this.advance();
		this.advance();

		let value = "";

		while (!this.isAtEnd()) {
			const char = this.peek();

			if (char === "\n" || char === "\r") {
				break;
			}

			value += this.advance();
		}

		return {
			type: TokenType.COMMENT,
			value: value.trim(),
			position: startPos,
		};
	}

	/**
	 * Scans a newline.
	 */
	private scanNewline(): Token {
		const startPos = this.getPosition();

		/*
		 * Handle Windows CRLF.
		 */
		if (this.peek() === "\r") {
			this.advance();

			if (this.peek() === "\n") {
				this.advance();
			}
		} else {
			/*
			 * Handle Unix LF.
			 */
			this.advance();
		}

		this.line++;
		this.column = 1;

		this.atLineStart = true;

		return {
			type: TokenType.NEWLINE,
			value: "\n",
			position: startPos,
		};
	}

	/**
	 * Consumes a single-character token.
	 */
	private consumeSingleChar(type: TokenType): Token {
		const position = this.getPosition();
		const value = this.advance();

		return {
			type,
			value,
			position,
		};
	}

	/**
	 * Skips spaces and tabs.
	 */
	private skipHorizontalWhitespace(): void {
		while (!this.isAtEnd()) {
			const char = this.peek();

			if (char === " " || char === "\t") {
				this.advance();
			} else {
				break;
			}
		}
	}

	/**
	 * Returns a character at the given offset
	 * from the current cursor.
	 */
	private peek(offset: number = 0): string {
		const index = this.cursor + offset;

		if (index >= this.source.length) {
			return "\0";
		}

		return this.source[index] ?? "\0";
	}

	/**
	 * Advances the cursor and returns the consumed character.
	 */
	private advance(): string {
		if (this.isAtEnd()) {
			return "\0";
		}

		const char = this.source[this.cursor] ?? "\0";

		this.cursor++;
		this.column++;

		return char;
	}

	/**
	 * Checks whether the lexer has reached EOF.
	 */
	private isAtEnd(): boolean {
		return this.cursor >= this.source.length;
	}

	/**
	 * Returns the current source position.
	 */
	private getPosition(): SourcePosition {
		return {
			line: this.line,
			column: this.column,
		};
	}

	/**
	 * Creates a token at the current source position.
	 */
	private createToken(type: TokenType, value: string): Token {
		return {
			type,
			value,
			position: this.getPosition(),
		};
	}

	/**
	 * Checks whether a character is alphabetic.
	 */
	private isAlpha(char: string): boolean {
		return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
	}

	/**
	 * Checks whether a character is alphanumeric.
	 */
	private isAlphaNumeric(char: string): boolean {
		return this.isAlpha(char) || (char >= "0" && char <= "9");
	}
}
