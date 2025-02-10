# Outs-Nuxt

## Notes:

- Apple iOs usage statistics: https://developer.apple.com/support/app-store/?utm_source=chatgpt.com (~70% of users are using iOs 18+)

## Bundle Logs

- Initial with TW4: 82.69kb. Package updates: 82.55kb
- With initial Powersync integtation: 467.01kb (the whole PS bundle is getting included, pre optimisation)
- With PowerSync OPFS and two OPFS viewer functions (not used atm): 467.38kb
- Feat: Capacitor added (only android), together with a build flag to detect web or cap: 467.68kb
- Feat: Capacitor iOs added and the PS conditional db logic fixed to separate between Android (IndexDB) vs Web + iOs (OPFS): 470.88kb