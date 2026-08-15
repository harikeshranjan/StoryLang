import { Lexer } from "../src/core/lexer/Lexer.js";
import { Parser } from "../src/core/parser/Parser.js";
import { StoryReader } from "../src/core/reader/StoryReader.js";

const reader = new StoryReader();
const source = await reader.read("examples/02_for_lexer.story");

const lexer = new Lexer(source);
const tokens = lexer.tokenize();

const parser = new Parser(tokens);
const result = parser.parse();

console.dir(result, {
	depth: null,
});
