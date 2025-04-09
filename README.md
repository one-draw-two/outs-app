# Outs-Nuxt

## Notes:

- Apple iOs usage statistics: https://developer.apple.com/support/app-store/?utm_source=chatgpt.com (~70% of users are using iOs 18+)
- Capacitor Backtround Runner (and alternative community plugin):
  - https://capacitorjs.com/docs/apis/background-runner
  - https://github.com/transistorsoft/capacitor-background-fetch
- [Offline Token Expiry Implementation](./_notes/OFFLINETOKENEXPITY.md) (implemented 27.03.25)
- [Removing a file from the git history](./_notes/REMOVEAFILEFROMGITHISTORY.md)
- While implementing a custom select component (for manual domain select for example):
  - https://github.com/ionic-team/cordova-plugin-ionic-webview/issues/654
  - https://developer.apple.com/support/alternative-browser-engines/
- Custom select related:
  - https://developer.chrome.com/blog/a-customizable-select
  - https://caniuse.com/mdn-css_properties_appearance_base-select (on 3/4/25 %46.14 global usage)
- Monetization related:
  - https://developer.apple.com/app-store/small-business-program/



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
- Refactor: Initial round layout and provide/inject composables: 480.2kb
- Fix: Nuxt useRoute() late params in layout issue is fixed with useNativeRoute in layouts: 480.71kb
- Wip: Adding challenge screens, also dayjs plugin added: 493.21kb
- Wip: Temporary RoundGoalCount submission component also added: 493.3kb
- Feat: Added bet to the challenge screens and refactored routing: 492.69kb
- Feat: usePopulatedRF now in PSQueries and mid page: 492.83kb
- Feat: Offline authentication enabled with @capacitor/preferences API (doesnt expire and not tested yet): 493.9kb
- Feat: Dynamic PS client parameters for real events (being tested): 494.33kb. Package updates: 496.5kb
- Feat: Capacitor push tokens and auth key expiration: 498.87kb. 499.02kb after package updates. Further package updates: 501.9kb
- Pre: Capacitor plugin: 499.32kb, with smoke test: 499.89kb