# WEB-69740

Minimal reproduction for [JetBrains YouTrack issue # WEB-69740](https://youtrack.jetbrains.com/issue/WEB-69740/Incorrect-Persistent-TSX-Errors)

I have narrowed down the problem to files that import functions from `libs/std/src/lib/sorting/groupAndSortByProps.ts`.
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
