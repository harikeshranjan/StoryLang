import { StoryReader } from "../core/reader/StoryReader.js";

const reader = new StoryReader();
const source = await reader.read("examples/01_the_beginning.story");

console.log(source);
