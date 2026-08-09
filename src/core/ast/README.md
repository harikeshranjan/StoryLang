# AST

An Abstract Syntax Tree (AST) is a hierarchical, tree-like data structure that represents the logical structure of a program's source code. Generated during the parsing (syntax analysis) phase of a compiler, it serves as a critical bridge between raw human-written text and executable machine code. ~ Medium

Contains the data structures representing a StoryLang document.

For example, eventually:

```typescript
interface StoryDocument {
    ...
}
```

The AST is extremely important because this is the structure that everything else can consume later.
