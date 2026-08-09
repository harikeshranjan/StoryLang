import {
	StoryReader,
	StoryReaderError,
} from "../src/core/reader/StoryReader.js";

const reader = new StoryReader();

// Test 1: Successsful read
const content = await reader.read("examples/01_the_beginning.story");
console.log(content);

// Test 2: Unsuccessful read
try {
	await reader.read("package.json");
} catch (err) {
	if (err instanceof StoryReaderError) {
		console.log("Caught extension error: ", err.message);
	}
}
