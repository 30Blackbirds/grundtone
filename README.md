<div align="center">

# Grundtone

**Open source design tokens for multi-brand theming — update once, apply everywhere.**\
A self-hosted design system for Vue 3, Nuxt 3 and React Native.

[![CI](https://github.com/30Blackbirds/grundtone/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/30Blackbirds/grundtone/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@grundtone/vue?label=%40grundtone%2Fvue)](https://www.npmjs.com/package/@grundtone/vue)
[![npm downloads](https://img.shields.io/npm/dm/@grundtone/vue)](https://www.npmjs.com/package/@grundtone/vue)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

[Documentation](https://grundtone.dev) · [npm](https://www.npmjs.com/org/grundtone) ·
[Report a bug](https://github.com/30Blackbirds/grundtone/issues/new/choose) ·
[Contributing](./CONTRIBUTING.md)

</div>

---

## Features

- **Token-driven theming** — one theme object drives colours, spacing, typography and more, with
  light and dark modes.
- **Vue 3 components** — accessible atoms and molecules (`GTButton`, inputs, selects, tooltips, …)
  plus composables such as `useTheme`.
- **Nuxt 3 module** — components and composables are auto-imported.
- **React Native** — a theme provider and hooks built on the same `@grundtone/core` themes.
- **SCSS and CSS layer** — token functions, mixins and utilities for any web framework, or plain
  HTML.
- **AI tooling** — an MCP server that exposes components and tokens to AI assistants.
- **Self-hosted** — MIT licensed, no hosted service required.

## Table of contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Configuration and theming](#configuration-and-theming)
- [Packages](#packages)
- [Architecture](#architecture)
- [Development](#development)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)
- [Links](#links)

## Prerequisites

| Use case                       | Requirement                                                        |
| ------------------------------ | ------------------------------------------------------------------ |
| Using the packages in your app | A project on a supported framework (see the quick starts below)    |
| Developing in this repository  | Node.js `>= 24.15.0` (see [`.nvmrc`](./.nvmrc)) and pnpm `10.14.0` |

Peer requirements of the published packages: `@grundtone/vue` needs Vue `^3.5.13`; `@grundtone/nuxt`
supports Nuxt `>=3.0.0`; `@grundtone/react-native` needs React `>=18`, React Native `>=0.72`, Expo
`>=52` and `react-native-svg >=13`.

## Installation

### From npm

All packages are published under the [`@grundtone`](https://www.npmjs.com/org/grundtone) scope.
Install the ones you need — see the [quick starts](#quick-start) for the right combination per
framework:

```bash
npm install @grundtone/vue @grundtone/design-system
```

pnpm and yarn work the same way (`pnpm add …`, `yarn add …`).

### Self-hosted (from source)

Build the packages yourself, for example to run a fork or to try unreleased changes:

```bash
git clone https://github.com/30Blackbirds/grundtone.git
cd grundtone
corepack enable          # activates the pinned pnpm version
pnpm install
pnpm build:packages      # builds everything under packages/*
```

The built packages are in `packages/*/dist`. To use them in another project, either publish them to
your own registry or link them locally (for example with `pnpm link` or a `file:` dependency).

## Quick start

### Vue 3

```bash
npm install @grundtone/vue @grundtone/design-system
```

```ts
// main.ts
import '@grundtone/vue/css';
```

```vue
<script setup>
  import { GTButton } from '@grundtone/vue';
</script>

<template>
  <GTButton variant="primary">Submit</GTButton>
</template>
```

### Nuxt 3

```bash
npm install -D @grundtone/nuxt
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@grundtone/nuxt'],
});
```

Components and composables are auto-imported, the stylesheet and self-hosted fonts are registered
for you, and the SCSS `tokens` namespace is available in your own styles.

### Design tokens (any framework)

```bash
npm install @grundtone/design-system
```

```scss
@use '@grundtone/design-system/scss' as tokens;

.card {
  color: tokens.color('primary');
  padding: tokens.units(3);
  box-shadow: tokens.shadow('medium');
}
```

Prefer plain CSS? The compiled stylesheet is exported as `@grundtone/design-system/css`, and the web
fonts as `@grundtone/design-system/fonts.css`.

### React Native

```bash
npm install @grundtone/react-native @grundtone/core
```

```tsx
import { GrundtoneThemeProvider } from '@grundtone/react-native';
import { createTheme } from '@grundtone/core';

const { light, dark } = createTheme({/* ... */});

export default function App() {
  return (
    <GrundtoneThemeProvider light={light} dark={dark}>
      <RootNavigator />
    </GrundtoneThemeProvider>
  );
}
```

## Configuration and theming

Themes are created with `createTheme()` from `@grundtone/core`, which accepts overrides per colour
mode and returns a `{ light, dark }` pair.

```ts
import { createTheme } from '@grundtone/core';

const theme = createTheme({
  light: { colors: { primary: '#your-brand' } },
});
```

- **Vue** — pass the theme to the `GrundtoneThemeProvider` component, and read or switch the mode
  with the `useTheme` composable.
- **Nuxt** — set it under the `grundtone` key in `nuxt.config.ts`. Other options: `components`
  (auto-import components, default `true`), `composables` (default `true`) and `prefix` (component
  prefix, default `GT`).
- **React Native** — pass `light` and `dark` to `GrundtoneThemeProvider`, as shown above.

```ts
// nuxt.config.ts
import { createTheme } from '@grundtone/core';

export default defineNuxtConfig({
  modules: ['@grundtone/nuxt'],
  grundtone: {
    theme: createTheme({ light: { colors: { primary: '#your-brand' } } }),
  },
});
```

The full theme shape, token reference and component documentation are on
[grundtone.dev](https://grundtone.dev).

## Packages

All packages are published to npm under the `@grundtone` scope.

| Package                                                | Description                                                    |
| ------------------------------------------------------ | -------------------------------------------------------------- |
| [`@grundtone/core`](./packages/core)                   | Theme system, config, types, branding, icon registry           |
| [`@grundtone/design-system`](./packages/design-system) | SCSS tokens, utilities, components, CSS + vanilla JS behaviors |
| [`@grundtone/utils`](./packages/utils)                 | Validation, formatting, ID generation                          |
| [`@grundtone/icons`](./packages/icons)                 | SVG icon registry (auto-generated)                             |
| [`@grundtone/vue`](./packages/vue)                     | Vue 3 component library and composables                        |
| [`@grundtone/nuxt`](./packages/nuxt)                   | Nuxt 3 module with auto-imports                                |
| [`@grundtone/react-native`](./packages/react-native)   | React Native theme provider and hooks                          |
| [`@grundtone/mcp`](./packages/mcp)                     | MCP server exposing components and tokens to AI tools          |
| [`@grundtone/email`](./packages/email)                 | Token-themed email building blocks, compiled to inlined HTML   |

The repository also contains [`packages/tokens-rust`](./packages/tokens-rust), a Rust crate with the
design tokens for native code. It is not published to crates.io.

> **Version numbers are not synchronised, and are not meant to be.** Each package is versioned by
> what changed in it, so a bump means something happened there. The packages are still pinned to
> each other: a published `@grundtone/vue` names the exact `@grundtone/core` and
> `@grundtone/design-system` it was built against, so installing one version resolves the rest
> unambiguously.

### Apps

| App                                                        | Description                               |
| ---------------------------------------------------------- | ----------------------------------------- |
| [`apps/docs`](./apps/docs)                                 | VitePress documentation site              |
| [`apps/playground/vue`](./apps/playground/vue)             | Vue 3 playground (blog, shop, components) |
| [`apps/playground/nuxt`](./apps/playground/nuxt)           | Nuxt 3 playground                         |
| [`apps/playground/html-test`](./apps/playground/html-test) | Plain HTML playground (no framework)      |
| [`apps/playground/expo`](./apps/playground/expo)           | React Native / Expo playground            |

## Architecture

```
core                 Theme types, createTheme(), presets
 ├── design-system   SCSS/CSS layer for web
 ├── utils           Formatting & validation utilities
 ├── icons           SVG icon registry
 ├── react-native    RN theme provider & hooks
 ├── vue             Vue 3 components & composables
 └── nuxt            Nuxt 3 module (auto-imports vue + composables)
```

More detail in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Development

Requires Node.js `>= 24.15.0` and pnpm `10.14.0` (pinned in `package.json`; `corepack enable` is the
easiest route).

```bash
pnpm install
pnpm build           # build all packages and apps
pnpm test            # run all tests
```

### Root commands

| Command               | Description                       |
| --------------------- | --------------------------------- |
| `pnpm build`          | Build all packages and apps       |
| `pnpm build:packages` | Build only `packages/*`           |
| `pnpm dev`            | Start all dev servers in parallel |
| `pnpm test`           | Run all tests                     |
| `pnpm test:watch`     | Run tests in watch mode           |
| `pnpm test:coverage`  | Run tests with coverage           |
| `pnpm lint`           | Lint all packages                 |
| `pnpm typecheck`      | TypeScript type checking          |
| `pnpm lint:format`    | Check formatting with Prettier    |
| `pnpm clean`          | Remove build output via turbo     |
| `pnpm docs:dev`       | Start the docs dev server         |
| `pnpm docs:build`     | Build the docs for production     |
| `pnpm docs:preview`   | Preview the docs build            |

### Per-package commands

```bash
pnpm --filter @grundtone/vue build
pnpm --filter @grundtone/vue test
pnpm --filter @grundtone/vue dev

pnpm --filter @grundtone/icons generate:icons            # regenerate the icon registry
pnpm --filter @grundtone/design-system generate:tokens   # regenerate SCSS token defaults
```

### Playground apps

```bash
pnpm --filter @grundtone/vue-playground dev      # Vue SPA (blog, shop, component demos)
pnpm --filter @grundtone/nuxt-playground dev     # Nuxt
pnpm --filter @grundtone/html-test dev           # plain HTML + CSS
pnpm --filter @grundtone/expo-playground dev     # React Native / Expo
```

### Changesets and releases

Versioning uses [Changesets](https://github.com/changesets/changesets). Add one with
`pnpm changeset` for any change that affects a published package. Maintainers release with
`pnpm release`; see [`docs/CHANGESETS.md`](./docs/CHANGESETS.md).

## Contributing

Contributions are welcome — bug reports and accessibility findings especially. Please read
[CONTRIBUTING.md](./CONTRIBUTING.md) first, and note that participation is covered by the
[Code of Conduct](./CODE_OF_CONDUCT.md).

## Security

Please do not open a public issue for a vulnerability. See [SECURITY.md](./SECURITY.md) for how to
report one privately.

## License

[MIT](./LICENSE)

## Links

- Documentation: [grundtone.dev](https://grundtone.dev)
- npm: [@grundtone](https://www.npmjs.com/org/grundtone)
- Issues:
  [github.com/30Blackbirds/grundtone/issues](https://github.com/30Blackbirds/grundtone/issues)
- Changelogs: in each package's `CHANGELOG.md`
