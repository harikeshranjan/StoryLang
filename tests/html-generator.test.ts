import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { Lexer } from "../src/core/lexer/Lexer.js";
import { Parser } from "../src/core/parser/Parser.js";
import { StoryReader } from "../src/core/reader/StoryReader.js";
import { HtmlGenerator } from "../src/core/renderer/HtmlGenerator.js";

const outputPath = "result/html/output.html";

const reader = new StoryReader();
const source = await reader.read("examples/02_for_lexer.story");

const lexer = new Lexer(source);
const tokens = lexer.tokenize();

const parser = new Parser(tokens);
const result = parser.parse();

if (result.diagnostics.length > 0) {
	console.log("Diagnostics: ");

	for (const diagnostic of result.diagnostics) {
		console.log(
			`${diagnostic.severity.toUpperCase()}: ` +
				`${diagnostic.message} ` +
				`(${diagnostic.location.line}:${diagnostic.location.column})`,
		);
	}
}

const generator = new HtmlGenerator();
const html = generator.generate(result.ast);

// 1. Ensure output directory exists before writing
mkdirSync(dirname(outputPath), { recursive: true });

// 2. Overwrite file cleanly with fresh HTML output
writeFileSync(outputPath, html, "utf-8");

console.log(`HTML generated successfully at ${outputPath}`);
