import type { SourceLocation, Story } from "../ast/AST.js";

export interface Diagnostic {
	message: string;
	location: SourceLocation;
	severity: "warning" | "error";
}

export interface ParserResult {
	ast: Story;
	diagnostics: Diagnostic[];
}
