import { readFile } from "node:fs/promises";
import { extname } from "node:path";

export interface StoryReaderOptions {
	/**
	 * Allowed file extensions.
	 * Defaults to [".story"]
	 */
	allowedExtensions?: string[];
}

export class StoryReaderError extends Error {
	constructor(
		message: string,
		public readonly code:
			| "FILE_NOT_FOUND"
			| "INVALID_EXTENSION"
			| "READ_ERROR",
		public readonly filePath: string,
		public readonly cause?: unknown,
	) {
		super(message);
		this.name = "StoryReaderError";
	}
}

export class StoryReader {
	private allowedExtensions: Set<String>;

	constructor(options: StoryReaderOptions = {}) {
		this.allowedExtensions = new Set(
			options.allowedExtensions ?? [".story"],
		);
	}

	/**
	 * Reads a StoryLang document from the given file path
	 *
	 * @param filePath - The path to the `.story` file.
	 * @throws {StoryReaderError} - If file extension is invalid, file missing or unreadable
	 */
	async read(filePath: string): Promise<string> {
		this.validateExtension(filePath);

		try {
			const content = await readFile(filePath, "utf8");
			return content;
		} catch (error: any) {
			if (error?.code === "ENOENT") {
				throw new StoryReaderError(
					`Story file not found at path: "${filePath}"`,
					"FILE_NOT_FOUND",
					filePath,
					error,
				);
			}

			throw new StoryReaderError(
				`Failed to read the Story file at ${filePath}: ${error?.message || "Unknown Error"}`,
				"READ_ERROR",
				filePath,
				error,
			);
		}
	}

	/**
	 * Synchronously validates file extension
	 *
	 * @param filePath
	 */
	private validateExtension(filePath: string): void {
		const ext = extname(filePath).toLowerCase();

		if (!this.allowedExtensions.has(ext)) {
			const expected = Array.from(this.allowedExtensions).join(", ");
			throw new StoryReaderError(
				`Invalid file extension ${ext || "(none)"}. Expected: ${expected}`,
				"INVALID_EXTENSION",
				filePath,
			);
		}
	}
}
