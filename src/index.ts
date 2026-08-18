/**
 * StoryLang
 *
 * Public entry point for StoryLang core library
 *
 * The implementation will gradually expose functionality such as:
 * - Reading .story documents
 * - Lexing source text
 * - Parsing tokens into an AST
 * - Document validation
 * - Rendering
 *
 * Keep implementation details inside their respective modules.
 */

import { Lexer } from "./core/lexer/Lexer.js";
import { Parser } from "./core/parser/Parser.js";
import type { ParserResult } from "./core/parser/ParserResult.js";
import { HtmlGenerator } from "./core/renderer/HtmlGenerator.js";

/**
 * Parses the given source text into an AST and any diagnostics.
 *
 * @param source
 * @returns `ParserResult` - the parsed AST and any diagnostics
 */
export function parse(source: string): ParserResult {
	const lexer = new Lexer(source);
	const tokens = lexer.tokenize();
	const parser = new Parser(tokens);
	return parser.parse();
}

/**
 * Compiles the given source text into HTML.
 *
 * @param source
 * @returns `string` - the compiled HTML
 */
export function compile(source: string): string {
	const { ast } = parse(source);
	const generator = new HtmlGenerator();
	return generator.generate(ast);
}

// Public API will be exported from here as StoryLang grows
export * from "./core/ast/AST.js";
export * from "./core/lexer/Lexer.js";
export * from "./core/reader/StoryReader.js";
export * from "./core/parser/Parser.js";
export * from "./core/renderer/HtmlGenerator.js";

// Temporary marker while the core API is being developed.
export const VERSION = "0.1.0-alpha.1";
