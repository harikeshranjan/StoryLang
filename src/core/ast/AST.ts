export interface SourceLocation {
	line: number;
	column: number;
}

export interface Story {
	type: "story";
	metadata: Metadata[];
	children: StoryNode[];
}

export interface Metadata {
	type: "metadata";
	key: string;
	value: string;
	location: SourceLocation;
}

export type StoryNode = Paragraph | Scene | Dialogue | Chapter;

export interface Chapter {
	type: "chapter";
	title: string;
	children: StoryNode[];
	location: SourceLocation;
}

export interface Scene {
	type: "scene";
	children: StoryNode[];
	location: SourceLocation;
}

export interface Dialogue {
	type: "dialogue";
	speaker: string;
	text: string;
	location: SourceLocation;
}

export interface Paragraph {
	type: "paragraph";
	text: string;
	location: SourceLocation;
}
