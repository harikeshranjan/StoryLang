import type { TokenType } from "./TokenType.js";

export interface SourcePosition {
	line: number;
	column: number;
}

export interface Token {
	type: TokenType;
	value: string;
	position: SourcePosition;
}
