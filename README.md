# Outs-App

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

- Previously there was an issue with not getting parameters in Nuxt layouts but its resolved with the latest architecture therefore these blocks have been removed:

```
import { useRoute as useNativeRoute } from 'vue-router'
const nativeRoute = useNativeRoute()
nativeRoute.params.stid // Then use like this
```

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
- Pre: Capacitor plugin: 499.32kb, with smoke test: 499.58kb
- Wip: Offline status, pre dayJS last synced diff: 500.25kb, when the network button and tray components ready: 501.96kb
- Fix: For a wider platform network status detection, using @capacitor/network: 502.89kb
- Package updates: @powersync/web -> 1.19.0 and nuxt -> 3.17.0: 505.4kb
- Wip: Snapshots and point columns are getting implemented in the round page: 506.32kb
- Feat: Added token endpoint and made useSecureFetch more flexible: 506.32kb. With RefreshToken fix: 506.41kb
- Wip: Group fixtures / stage queryies and PS watcher reworking (and powersync/web 1.20.0): 502.81kb
- Pre: Starting front-end layout (round/stage/season views): 503.95kb
- Feat: Capacitor plugin for insets: 505.17kb
- Switched to GPT-4.1: And upgradedPSUtils for a watchSource (to use in season picker from children round components): 505.36kb
- Pre: User button modal/overlay component: 505.36kb
- Feat: User overlay (with keyboard listener and simple transitions): 506.41kb
- Wip: Also adding a stage picker (at the header), but the routing / latest data doesnt work as good as expected yet: 507.05kb
- Wip: Major refactroing in routing, pre moving to a generic entry route [eid] under seasons: 509.07kb
- Wip: [eid] idea dropped, now continuing with Nuxt pages/routing but not nested calendar entities, need to fix pickers: 508.22kb
- Pre: Dismantling usePSQueries largely to fix reactivity in places where i need: 508.53kb
- Wip: Ditching psQuery composables and now using more granular queries directly where i need them, this optimises performance and reduces errors: 508.45kb
- Wip: Improving round routes data fetching: 508.83kb, then further refactoring and fixes: 508.88kb
- Wip: Round page UI and navigation improvements: 510.11kb
- Wip: Initial horizontal season calendar: 510.72kb
- Feat: Tournament based round fixture pages (quick): 515.2kb
- Wip: Trying the PS token reissue logic: 515.64kb. After package updates including powersync/web and dependencies: 503.79kb
- Feat: With Decorations and TripleCrop svg clip components (dummy): 504.77kb
- Pre: Refactoring the fixtures into the match point columns: 505.31kb, first round of refactoring: 506.12kb
- Feat: Initial, not functioning round horizontal progress component: 507.15kb
- Wip: Simple fixture points display component: 507.49kb
- Wip: Dummy points matrix (to be changed), and some types refactoring: 509.75kb
- Refactoring: Types and some enhancedFixture logic removed and simplified: 509.58kb
- Wip: Curves points are getting added: 510.09kb
- Wip: Standings page (for curves initially) with vue transition rows: 511.81kb, with the nuxt update (3.17.6): 510.65kb
- Wip: Navigation is getting restructured, group relationships are getting added: 512.07kb
- Wip: Fixtures page moved under standings: 513.28kb.
- Wip: Standings table styling and navigation improvements (initial work): 514.83kb
- Wip: Season main table is now a table but table needs many more features: 514.86kb
- Pre: Removing stage selector, with initial Layo components to remove layouts: 514.56kb
- Refactor: Removed stagepciker, will remove the layouts completely because they dont update with route change (retarded Nuxt): 513.98kb
- Refactor: All layouts removed, round provide/inject functionality has been added to a middleware now: 513.07kb
- Wip: Header styling and logo: 511.68kb (disabled components): 511.66kb after package updates
- Wip: Table improvements: 511.85kb
- Feat: Instead of match routes, now there are challenge type based (initial, dummy) routes and components: 512.93kb
- Pre: Nuxt 4 update: 513.01kb, after the update (and the migration that changed a lot of paths): 515.1kb
- Feat: Table logic improved (wip) with backend schema: 515.62kb
- Wip: Table, responsive with sticky and widths working (not tested fully): 517.69kb
- Wip: Powersync load error handling (not tested thoroughly): 517.82kb
- Pre: Table responsive fixes: 519.34kb, 519.35kb after nuxt 4.0.2 update.
- Feat: Breadcrumbs for standings: 520.18kb
- Feat: With HugeIcons: 524.67kb
- Feat: useViewport composable and TableBGScroll component: 525.79kb
- Wip: Table improvements and styling: 527.31kb, further: 528.06kb
