# Components

Isolated, reusable React components.

## Critical Rules

**Component structure** - Each component lives in its own directory:

```
ComponentName/
├── ComponentName.tsx       # Arrow function, named export
├── ComponentName.css.ts    # Vanilla Extract styles
├── ComponentName.test.tsx
├── index.ts                # export * from './ComponentName'
└── types.ts                # (optional) shared types, not just props; use this where
                            # types may need to be shared between components without creating
                            # circular dependencies
```

**Exports** - Use named exports with arrow functions, not default exports:

```tsx
export const ComponentName = ({ label }: ComponentNameProps) => { ... };
```

**Barrel files** - Use wildcard re-exports:

```ts
// ComponentName/index.ts
export * from './ComponentName';
export * from './types'; // if types.ts exists

// Parent index.ts - add one line per component
export * from './ComponentName';
```

## Detailed Guides

Read these as needed for the specific task:

- Writing styles? See [docs/STYLING.md](docs/STYLING.md)
- Writing tests? See [docs/TESTING.md](docs/TESTING.md)
- Need a reference? See [docs/EXAMPLE.md](docs/EXAMPLE.md)

## Checklist

Before completing a component:

- [ ] Own directory with matching PascalCase name
- [ ] Named export with arrow function syntax
- [ ] Separate `.css.ts` file
- [ ] Barrel file with `export *`
- [ ] Tests using `getByRole` queries (see TESTING.md for priority)
- [ ] JSDoc comments on props
- [ ] ESLint passes
