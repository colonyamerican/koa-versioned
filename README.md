# koa-versioned
An API versioning middleware for `koa-router`.

# Installation
`yarn add koa-versioned`

# Usage
```js
import versioned from "koa-versioned";
import Koa from "koa";
import Router from "koa-router";

const app = new Koa();
const router = new Router();
versioned({
    app: app,
    router: router,
    supported_versions: ['v1', 'v2'],
    current_version: '1.0.1'
});
```