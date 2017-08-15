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
app.use(versioned(router, {
    // Allows for optional overrides
    supported_versions: ['v1', 'v2'],       // Defaults to all discovered version directories
    current_version: '1.0.1'                // Defaults to version in `${process.cwd()}/package.json`
    base_path: `${__dirname}/endpoints`,    // Defaults to `${process.cwd()}/endpoints`
    // OR
    glob: `${__dirname}/endpoints/*`,       // Define a glob used to locate version directories
    glob_options: {}                        // Options passed to `glob`
});
```