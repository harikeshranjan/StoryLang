# Lexer

The lexer is responsible for tokenizing the source code into a stream of tokens.

For example:

```
title = "My story"
```

might eventually become something conceptually like:

```
IDENTIFIER("title")
STRING("My Story")
```

The lexer should not understand the complete story structure.

Its job is simply:

> Characters -> Token
