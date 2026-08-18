# StoryLang

StoryLang is a domain-specific language (DSL) designed specifically for narrative writing. It provides a structured and expressive way to write stories while abstracting away formatting and other technical considerations.

The primary idea behind StoryLang is to allow writers to focus on what they want to tell, rather than how the story should be formatted or represented. By following a simple and predefined structure, users can describe characters, scenes, dialogue, narration, and other elements of a story without having to manually manage the underlying formatting.

## Motivation

Traditional writing tools often mix content creation with presentation and formatting. While this is useful for producing a final document, it can also introduce unnecessary complexity when the primary goal is simply to write and structure a narrative.

StoryLang approaches this problem differently. Instead of treating a story as a collection of formatted text, it treats the story as a structured set of narrative elements. The writer describes the content using StoryLang's syntax, and the language can then be interpreted or processed to produce the desired output.

This separation between content and presentation makes it possible for writers to concentrate on storytelling while allowing the system to handle formatting and other technical details automatically.

## Goals

StoryLang is designed with the following goals in mind:

- Provide a simple and readable syntax for writing stories.
- Allow writers to focus on narrative content rather than formatting.
- Represent common storytelling elements in a structured way.
- Make stories easier for software to parse, process, and transform.
- Separate the content of a story from its final presentation.
- Provide a foundation for generating different forms of output from the same story.

## How it works

A StoryLang document follows a predefined structure. Instead of manually formatting elements such as character names, dialogue, scenes, or narration, the writer expresses these elements using StoryLang's syntax.

For example, a story might conceptually contain:

- **Characters** — the people or entities involved in the story.
- **Scenes** — different locations, situations, or sections of the narrative.
- **Narration** — descriptive text that explains what is happening.
- **Dialogue** — conversations between characters.
- **Actions** — events or actions performed by characters.

The exact syntax allows these elements to be represented consistently, making the resulting story both human-readable and machine-readable.

## Why a DSL?

A general-purpose programming language provides far more functionality than is necessary for writing a story. StoryLang instead provides a smaller language focused specifically on narrative structure.

This makes the language easier to understand for its intended purpose while also giving programs the ability to understand the structure of a story. Because the story is represented using a defined language, it can potentially be converted into different formats, analyzed, edited programmatically, or used as input for other storytelling tools.

## Design Philosophy

StoryLang follows a simple principle:

> Writers should focus on the story; the system should handle the technical details.

The syntax is therefore intended to be descriptive rather than overly technical. A StoryLang document should still feel understandable to someone reading the source, while providing enough structure for a parser or other tools to process it reliably.

## Future Scope

StoryLang can be extended beyond basic narrative writing. Future versions could support additional storytelling concepts such as story branches, timelines, character relationships, locations, emotions, events, and metadata.

The language could also be used as the foundation for tools that generate different outputs from the same story, such as formatted documents, scripts, interactive narratives, or other digital storytelling formats.

## Basic Structure

A StoryLang document consists of the following components:

- `Metadata`
- `Chapters`
- `Scenes`
- `Narration`
- `Dialogue`
- `Comments`

### Metadata

Metadata is used to describe information about the story. It can include the story's title, author, date, genre, and other relevant details.

Metadata is written in the following format:

```python
key: value
```

**For example:**

```storylang
title: The Last City
author: Aryan
genre: Fantasy
```

Metadata appears at the beginning of the document and provides information about the story without being part of the narrative itself.

Additional metadata fields can be introduced as the language evolves.

---

### Chapters

Chapters are used to divide the story into sections or scenes. Each chapter can have its own title and content.

A chapter starts with a `#` followed by the chapter name.

```storylang
# Chapter 1

The city was silent.

# Chapter 2

The gate was opened.
```

Chapters make it possible to organize a story into separate sections while keeping the source simple.

The chapter heading is structural information. The StoryLang processor can decide how that heading should appear in the final output.

---

### Scenes

Scenes are used to describe the individual events and actions within a chapter.

Scenes are declared using the `@scene` keyword.

A scene represents a section of the story in which a particular sequence of events takes place.

**For example:**

```storylang
# Chapter 1

@scene The rain never stopped.

Alice: We shouldn't be here.

Bob: We came too far to turn back.
```

The `@scene` declaration tells the processor that the following content belongs to a scene.

Scenes can be used to give the story additional structural information without requiring the writer to manually format the document.

---

### Narration

Normal text that does not follow a special StoryLang construct is treated as narration.

**For example:**

```storylang
The rain never stopped.

Lightning flashed across the sky.

The two characters looked at each other.
```

This allows the writer to write prose naturally.

There is no special keyword required for narration.

This is one of the important design principles of StoryLang: **ordinary prose should remain ordinary prose.**

---

### Dialogue

Dialogue is represented using a character name followed by a colon.

**For example:**

```storylang
Alice: We shouldn't be here.

Bob: We came too far to turn back.
```

The general syntax is:

```storylang
Character: Dialogue
```

**For example:**

```storylang
Bob: To the old city.

Alice: Nobody goes there anymore.

Bob: That's exactly why we have to go.
```

The character name identifies the speaker, while everything after the colon represents the character's dialogue.

This structure allows the StoryLang processor to distinguish dialogue from ordinary narration.

---

### Comments

Comments allow writers to add notes to the StoryLang source without including those notes in the final story.
A comment begins with `//`.

**For example:**

```storylang
// This is a comment
```

**For example:**

```storylang
// The characters enter the abandoned city.
```

Comments are ignored when the story is processed.

They can be useful for:

- Development notes
- Reminders
- Explanations
- Debugging
- Notes about a particular scene
- Temporarily documenting parts of the story

**For example:**

```storylang
// TODO: Add more description to this scene.
```

---

### Syntax Summary

| Syntax            | Purpose                           |
| ----------------- | --------------------------------- |
| `key: value`      | Story metadata                    |
| `# Chapter`       | Defines a chapter                 |
| `@scene`          | Defines a scene                   |
| `Character: text` | Character dialogue                |
| `// comment`      | Comment ignored by the processor  |
| `Plain text`      | Narration                         |
| `Blank line`      | Separates content for readability |

---

## Project Status

StoryLang is currently under development.

The syntax and supported features may change as the language evolves.

The current implementation focuses on establishing the core syntax and parsing structure required to represent a narrative.
