import type {
	Chapter,
	Dialogue,
	Metadata,
	Paragraph,
	Scene,
	StoryNode,
} from "../ast/AST.js";
import type { Token } from "../lexer/Token.js";
import { TokenType } from "../lexer/TokenType.js";
import type { Diagnostic, ParserResult } from "./ParserResult.js";

export class Parser {
	private readonly tokens: Token[];
	private current: number = 0;
	private diagnostics: Diagnostic[] = [];

	constructor(tokens: Token[]) {
		this.tokens = tokens;
	}

	public parse(): ParserResult {
		const metadata: Metadata[] = [];
		const children: StoryNode[] = [];

		while (!this.isAtEnd()) {
			this.skipNewlineAndComments();

			if (this.isAtEnd()) break;

			if (this.isMetadataStart()) {
				metadata.push(this.parseMetadata());
				continue;
			}

			if (this.check(TokenType.HASH)) {
				children.push(this.parseChapter());
				continue;
			}

			if (this.check(TokenType.AT)) {
				children.push(this.parseScene());
				continue;
			}

			if (this.isDialogueStart()) {
				children.push(this.parseDialogue());
				continue;
			}

			if (this.check(TokenType.TEXT)) {
				children.push(this.parseParagraph());
				continue;
			}

			this.reportError(
				`Unexpected token "${this.peek().value}".`,
				this.peek(),
			);

			this.advance();
		}

		return {
			ast: {
				type: "story",
				metadata,
				children,
			},
			diagnostics: this.diagnostics,
		};
	}

	// Metadata
	private isMetadataStart(): boolean {
		return (
			this.check(TokenType.IDENTIFIER) && this.checkNext(TokenType.COLON)
		);
	}

	private parseMetadata(): Metadata {
		const keyToken = this.consume(
			TokenType.IDENTIFIER,
			"Expected metadata key.",
		);

		this.consume(TokenType.COLON, "Expected ':' after metadata key.");

		const value = this.consumeLineText("Expected metadata value.");

		return {
			type: "metadata",
			key: keyToken.value,
			value,
			location: keyToken.position,
		};
	}

	// Chapter
	private parseChapter(): Chapter {
		const hashToken = this.consume(TokenType.HASH, `Expected '#'.`);

		const title = this.consumeLineText(`Expected chapter title after '#'.`);

		const children: StoryNode[] = [];

		while (!this.isAtEnd()) {
			this.skipNewlineAndComments();

			if (this.isAtEnd()) break;
			if (this.check(TokenType.HASH)) break;

			if (this.isMetadataStart()) {
				this.reportError(
					"Metadata must appear before the story body.",
					this.peek(),
				);

				this.parseMetadata();
				continue;
			}

			if (this.check(TokenType.AT)) {
				children.push(this.parseScene());
				continue;
			}

			if (this.isDialogueStart()) {
				children.push(this.parseDialogue());
				continue;
			}

			if (this.check(TokenType.TEXT)) {
				children.push(this.parseParagraph());
				continue;
			}

			this.reportError(
				`Unexpected token "${this.peek().value}".`,
				this.peek(),
			);

			this.advance();
		}

		return {
			type: "chapter",
			title,
			children,
			location: hashToken.position,
		};
	}

	// Scenes
	private parseScene(): Scene {
		const atToken = this.consume(TokenType.AT, "Expected '@'.");

		const directive = this.consume(
			TokenType.IDENTIFIER,
			"Expected directive name after '@'",
		);

		if (directive.value !== "scene") {
			this.reportError(
				`Unknown directive "@${directive.value}".`,
				directive,
				"warning",
			);
		}

		this.consumeOptionalNewLine();

		const children: StoryNode[] = [];

		while (!this.isAtEnd()) {
			this.skipNewlineAndComments();

			if (this.isAtEnd()) break;

			// Scene ends at '@' or '#'
			if (this.check(TokenType.AT)) break;
			if (this.check(TokenType.HASH)) break;

			if (this.isDialogueStart()) {
				children.push(this.parseDialogue());
				continue;
			}

			if (this.check(TokenType.TEXT)) {
				children.push(this.parseParagraph());
				continue;
			}

			this.reportError(
				`Unexpected token "${this.peek().type}".`,
				this.peek(),
			);

			this.advance();
		}

		return {
			type: "scene",
			children,
			location: atToken.position,
		};
	}

	// Dialogue
	private isDialogueStart(): boolean {
		return (
			this.check(TokenType.IDENTIFIER) && this.checkNext(TokenType.COLON)
		);
	}

	private parseDialogue(): Dialogue {
		const speakerToken = this.consume(
			TokenType.IDENTIFIER,
			"Expected speaker name.",
		);

		this.consume(TokenType.COLON, "Expected ':' after speaker name.");

		const text = this.consumeLineText("Expected dialogue text.");

		return {
			type: "dialogue",
			speaker: speakerToken.value,
			text,
			location: speakerToken.position,
		};
	}

	// Paragraph
	private parseParagraph(): Paragraph {
		const token = this.consume(TokenType.TEXT, "Expected text.");

		return {
			type: "paragraph",
			text: token.value,
			location: token.position,
		};
	}

	// HELPER FUNCTIONS
	private consumeLineText(message: string): string {
		if (this.check(TokenType.TEXT)) {
			const token = this.advance();
			this.consumeOptionalNewLine();

			return token.value;
		}

		if (this.check(TokenType.NEWLINE)) {
			this.advance();
			return "";
		}

		this.reportError(message, this.peek());
		return "";
	}

	private skipNewlineAndComments(): void {
		while (!this.isAtEnd()) {
			if (this.check(TokenType.NEWLINE)) {
				this.advance();
				continue;
			}

			if (this.check(TokenType.COMMENT)) {
				this.advance();
				continue;
			}

			break;
		}
	}

	private consumeOptionalNewLine(): void {
		if (this.check(TokenType.NEWLINE)) {
			this.advance();
		}
	}

	private consume(type: TokenType, message: string): Token {
		if (this.check(type)) {
			return this.advance();
		}

		this.reportError(message, this.peek());

		return this.peek();
	}

	private check(type: TokenType): boolean {
		if (this.isAtEnd()) {
			return type === TokenType.EOF;
		}

		return this.peek().type === type;
	}

	private checkNext(type: TokenType): boolean {
		if (this.current + 1 >= this.tokens.length) {
			return false;
		}

		return this.tokens[this.current + 1]!.type === type;
	}

	private advance(): Token {
		if (!this.isAtEnd()) {
			this.current++;
		}
		return this.previous();
	}

	private peek(): Token {
		return this.tokens[this.current]!;
	}

	private previous(): Token {
		return this.tokens[this.current - 1]!;
	}

	private isAtEnd(): boolean {
		return this.peek().type === TokenType.EOF;
	}

	private reportError(
		message: string,
		token: Token,
		severity: "warning" | "error" = "error",
	): void {
		this.diagnostics.push({
			message,
			severity,
			location: token.position,
		});
	}
}
