# React Component Conventions

These conventions apply to **all React components** in the monorepo — whether
in `packages/`, `apps/`, or any other workspace that contains `.tsx` files.

## Component Structure

Each component lives in its own directory:

```
ComponentName/
├── ComponentName.tsx          # Arrow function, named export
├── ComponentName.css.ts       # (if needed) Styles written using Vanilla Extract
├── ComponentName.stories.tsx  # (if applicable) Storybook stories
├── ComponentName.test.tsx     # Tests
├── index.ts                   # export * from './ComponentName'
└── types.ts                   # (optional) shared types, not just props; use this where
                               # types may need to be shared between components without creating
                               # circular dependencies
```

Components that delegate all visual presentation to another component and have
no styles of their own may omit the `.css.ts` file.

## Exports

Use named exports with arrow functions, not default exports:

```tsx
export const ComponentName = ({ label }: ComponentNameProps) => { ... };
```

## Barrel files

Use wildcard re-exports:

```ts
// ComponentName/index.ts
export * from './ComponentName';
export * from './types'; // if types.ts exists
```

## Props

- Define props as an `interface` (not `type`) named `ComponentNameProps`
- Export the interface from the component file
- Add JSDoc comments to every prop
- Use `boolean` props with `is` prefix: `isChecked`, `isDisabled`, `isLoading`
- Use string unions (`type Variant = 'a' | 'b'`) instead of enums

## Design Philosophy

**Presentational first** — Components should be as free from business logic as
possible. Prefer purely presentational components that receive data and callbacks
via props. Avoid embedding domain-specific decisions, data fetching, or
state-management orchestration inside a component.

**Extract complex behaviour into custom hooks** — When a component requires
significant imperative logic (e.g. DOM measurement, scroll locking, focus
management, intersection observers, or other ref-based manipulation), extract
that behaviour into a custom `use*` hook. The hook should live alongside the
component (or in a shared `hooks/` directory when reusable) and return only the
refs, state, and handlers the component needs.

**Lift behaviour up** — Wherever possible, push side-effects and stateful logic
up and out of components so that the component tree remains a straightforward
mapping of props to UI. A component that is easy to render in Storybook with
static props is a good litmus test for this.

**Use AbstractText for any element that renders text** — Every element that
displays text content must use `AbstractText` (with the appropriate `tagName`,
`fontSize`, `fontWeight`, and `fontType` props) rather than a bare HTML element
with CSS font properties. This prevents the component from inheriting font
styles from its parent context. A `<span>` inside a `<td>` with a monospace
font will silently inherit that font unless `AbstractText` explicitly sets the
correct family and size. This applies to all elements — `<span>`, `<button>`,
`<div>`, `<label>` — not just primary text containers.

## Related Guides

- [Styling](STYLING.md) — Vanilla Extract, design tokens, color modes
- [Testing](TESTING.md) — React Testing Library, accessibility-first queries
- [Storybook](STORYBOOK.md) — CSF3 format, story best practices
- [Example](EXAMPLE.md) — Complete reference implementation
