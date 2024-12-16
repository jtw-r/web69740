# WEB-69740

Minimal reproduction for [JetBrains YouTrack issue # WEB-69740](https://youtrack.jetbrains.com/issue/WEB-69740/Incorrect-Persistent-TSX-Errors)

## Setup:
```shell
npm i
```

There are no build commands that need to be run. This is not a compilation or build problem, only type-checking / intellisense.

Typescript is pinned @ v5.4.5 due to the NX Monorepo dependency.

## Hypothesis

I have narrowed down the problem to files that import functions from `libs/std/src/lib/sorting/groupAndSortByProps.ts` and `libs/std/src/lib/sorting/groupAndSortStep.ts`.
I suspect it is due to the deep/recursive types in `libs/std/src/lib/types/Path.ts` and the helper functions in `libs/std/src/lib/deep/deep.ts` file.
The recursive types were copied from the `react-hook-form` repo, since they use them and I found them interesting.

## Reproduction
You can play around in `libs/src/src/index.ts` to experience the TypeScript server hanging, and auto-complete / hints / error highlighting not working.

On line # 30 of `libs/std/src/index.ts`, change the following:
```ts
const a = sorted.reverse();
```
to call a function that does not exist on arrays:
```ts
const a = sorted.foo();
```

No error highlighting should appear.
If you add other lines to the file (literally anything), the error highlighting goes a bit crazy or appears inconsistently.
Restarting the TypeScript server in WebStorm does not fix the issue.

**Tested on WebStorm Versions 2024.1.7 && 2024.3.1**
