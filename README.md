# Outs-Nuxt

## Notes:

- Apple iOs usage statistics: https://developer.apple.com/support/app-store/?utm_source=chatgpt.com (~70% of users are using iOs 18+)
- Capacitor Backtround Runner (and alternative community plugin):
  - https://capacitorjs.com/docs/apis/background-runner
  - https://github.com/transistorsoft/capacitor-background-fetch


## Bundle Logs

- Initial with TW4: 82.69kb. Package updates: 82.55kb
- With initial Powersync integtation: 467.01kb (the whole PS bundle is getting included, pre optimisation)
- With PowerSync OPFS and two OPFS viewer functions (not used atm): 467.38kb
- Feat: Capacitor added (only android), together with a build flag to detect web or cap: 467.68kb
- Feat: Capacitor iOs added and the PS conditional db logic fixed to separate between Android (IndexDB) vs Web + iOs (OPFS): 470.88kb
- Wip: Initial seasons selector logic in Nuxt (to further test PS interactions): 473.14kb
- Refactor: Parallel PS queries are now available via a composable: 473.19kb. With more composables: 473.26kb
- Feat: Round-id page added and NanoId conversion is finished: 474kb
- Wip: Match-id page added and pre re-factoring PS queries based on relationships and PS bucket definitions: 475.51kb
- Refactor: '@powersync/vue' package removed in order to use vanilla web tools: 473.96kb
- Wip: Implementing very simple authentication, pre installing background runner: 474.78kb (with the Capacitor CORS fix: 474.8kb)
- Feat: Initial JWT auth via deno: 476.93kb
- Feat: PS authentication and logout structure (skeleton): 477.01kb
- Feat: User subscriptions (via PS): 477.14kb
- Feat: PS Update highlighter directive: 478.17kb
- Wip: Live match details and populated queries (initial): 479.02kb