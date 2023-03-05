<div align="center">

![Logo](https://avatars.githubusercontent.com/u/126923974?s=200&v=4)

[![GitHub](https://img.shields.io/github/license/quority/fandom)](https://github.com/quority/fandom/blob/main/LICENSE.md)
[![npm](https://img.shields.io/npm/v/@quority/fandom?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@quority/fandom)
</div>

---
[@quority/core](https://www.npmjs.com/package/@quority/core) extension to support Fandom-specific features.

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
	- [Wiki instance](#wiki-instance)
	- [Discussions](#discussions)
	- [/wikia.php](#wikiaphp)

# Features
- Written in TypeScript.
- Extends @quority/core to support Fandom Discussions.
- Use interwiki format to create instances instead of the full API URL.
- Full TypeScript and JavaScript support.
- Can be used with CJS (`require`) or ESM (`import`).

# Installation
```bash
# npm
npm install @quority/fandom

# yarn
yarn add @quority/fandom
```
You don't need to install `@quority/core`, as this package will export a `Wiki` instance that works in the same way but includes other methods. However, core types aren't re-exported; if you need to use the types in your function signatures, consider adding `@quority/core` as a development dependency.

# Usage
For most uses, you will want to import the `Wiki` constructor. Code snippets will use ESM syntax, but you can use `require` instead:

```ts
// ESM
import { Wiki } from '@quority/fandom'

// CJS
const { Wiki } = require( '@quority/fandom' )
```

## Wiki instance
```ts
import { Wiki } from '@quority/fandom'

const community = new Wiki( {
	api: 'community'
} )
const spanishGenshin = new Wiki( {
	api: 'es.genshin-impact'
} )
const polishGothic = new Wiki( {
	api: 'pl.gothic'
} )
```

> :link: If you are not familiar with interwikis, take a look at the [help page](https://community.fandom.com/wiki/Help:Interwiki_link).

## Discussions
You can interact with most of the Discussions API using `@quority/fandom`. The typings for some responses may be inaccurate, if you find any error make sure to create an issue.

For most actions, you will need to login into your bot account. This requires your account's username and password, **not** using BotPasswords.

> :warning: If you intend to run scripts in a server or anywhere but your local machine, you should use a dedicated bot account instead, just in case you accidentally leak the password it is your bot's and not yours.
> 
> If that happens, make sure to **[change your password](https://auth.fandom.com/auth/settings)** as soon as possible.

```ts
const wiki = new Wiki( {
	// it might be a good idea to use a test wiki instead
	api: 'community'
} )
await wiki.platform.login( 'Username', 'Password' )
```

After using `#login`, all requests made will be made with your session. All custom supported endpoints are available through `wiki.custom`; currently, it only includes `/wikia.php`, which you can access using `wiki.custom.wikia`.

## /wikia.php
The endpoint includes most of the [Discussions API controllers](https://elderscrolls.fandom.com/wiki/User:Atvelonis/Bot/Discussions_API#API_controllers).

> 🧩 You can detach the controllers as you need to keep your code simpler and shorter. Both options work the same way:
```ts
// Chain until you reach the controller
const comments1 = await wiki.custom.wikia.ArticleCommentsController.getComments( 'Page 1' )
const comments2 = await wiki.custom.wikia.ArticleCommentsController.getComments( 'Page 2' )

// Or
const comments = wiki.custom.wikia.ArticleCommentsController
const comments1 = await comments.getComments( 'Page 1' )
const comments2 = await comments.getComments( 'Page 2' )
```
