# koa-versioned
An API versioning middleware for `koa-router`.

# Installation
`yarn add koa-versioned`

# Explanation
`koa-versioned` will scan directories to seek versioned endpoints and register them with `koa-router`.
By default, `koa-versioned` will seek out any files in `endpoints/v*`, matching `endpoints/v1/index.js` and `/endpoints/v2/foo/bar.js`. 

Files in a directory matching the current application version will be served without a version prefix, i.e. `api/`

Files in a directory not matching the application version will only be served from a route with a version prefix, i.e. `api/v1`

Route files should export a default method that accepts a `koa-router` instance as the first argument, and a version prefix method as the second argument.

Any file included in a versioned endpoint directory will be loaded as a route file.

# Usage
### index.js
```js
import versioned from "koa-versioned";
import Koa from "koa";
import Router from "koa-router";

const app = new Koa();
const router = new Router();
app.use(versioned(router, {
    // Define an array of supported version directories (optional)
    supported_versions: ['v1', 'v2'],       // Defaults to all discovered version directories

    // Define the current application version (optional)
    current_version: '1.0.1'                // Defaults to version in `${process.cwd()}/package.json`

    // Define the base path for version directories (optional)
    base_path: `${__dirname}/endpoints`,    // Defaults to `${process.cwd()}/endpoints`

    // Define a glob used to locate version directories (optional)
    glob: `${__dirname}/endpoints/v*`,       // Defaults to `${options.base_path}/v*`

    // Provide options to the glob method (optional)
    glob_options: {},                       // Options passed to `glob`

    // Prefix URLs (optional)
    route_prefix: "/api"                    // Defaults to ""
});
```
### endpoints/v1/index.js
```js
export default (router, v) => {
    // the "v" method prefixes the URL with the appropriate version string
    // (or none, for the current version)
    router.get(v("/"), (ctx, next) => {
        ctx.body = { version: "1.0" };
    });
};
```