
## Wormhole Web Wallet

This is the repository for [Wormhole Web Wallet](https://wallet.wormhole.cash).

## Local Development

1. Install [node.js](https://nodejs.org) if you don't have them already.
2. `cd` to the repository directory and run the following command `npm install`.
3. Run the script `npm run local`.
4. Then, load  [http://localhost:8080](http://localhost:8080) on your browser.

## Backend Api Service

 Backend Api Service for this repository,more details at [Backend Api Service]( https://github.com/copernet/whcwallet).

## Tech Stack

#### Core

- [ ] [Vue](https://github.com/vuejs/vue)
- [ ] [Vue Router](https://github.com/vuejs/vue-router)
- [ ] [Vuex](https://github.com/vuejs/vuex)
- [ ] [Quasar](https://github.com/quasarframework/quasar)
- [ ] [Vue-i18n](https://github.com/kazupon/vue-i18n)

#### Linting

We follow the rules outlined by the [Javascript Standard Style](https://standardjs.com/rules.html) as well as a few Vue specific rules.

Code linting is handled by [ESLint](https://eslint.org/). The following commands are available:
 * `npm run lint` Lints all packages

These IDE plugins/packages assist with complying with these lint rules while developing:

 * [Atom](https://atom.io/packages/linter-js-standard)
 * [VS Code](https://marketplace.visualstudio.com/items?itemName=chenxsan.vscode-standardjs)
 * [WebStorm](https://blog.jetbrains.com/webstorm/2017/04/using-javascript-standard-style/)

## Contribute

Bug fixes and feedback on our code is always appreciated.

#### Adding Translations

To add translations to the project, use `message/en.json` as a template and create a new json file for the language of your choice using its [ISO 639-1 code](http://www.loc.gov/standards/iso639-2/php/code_list.php) as its name.Then translate all the content inside of the file and send us a pull request.

## About Wormhole

Wormhole is a fast, portable Omni Layer implementation that is based off the Bitcoin ABC codebase. This implementation requires no external dependencies extraneous to Bitcoin ABC, and is native to the Bitcoin Cash network just like other Bitcoin Cash nodes. It currently supports a wallet mode and is seamlessly available on three platforms: Windows, Linux and Mac OS. Wormhole Cash Layer extensions are exposed via the JSON-RPC interface. Development has been consolidated on the Wormhole product, and it is the reference client for the Wormhole Cash Layer.

## License

[Apache-2.0](./LICENSE)
