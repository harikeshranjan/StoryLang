# Reader

`src/reader/`

Responsible for reading the `.story` files.

Eventually:

```txt
.story
   ↓
Reader
   ↓
string
```

For example:

```txt
story.story
```

becomes:

```typescript
const source: string;
```
