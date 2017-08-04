// @flow
import fs from "fs";
import path from "path";
import glob from "glob";
import semver from "semver";

/**
 * Versioning tool for Koa router
 * ------------------------------
 * Reads version directories for route controllers
 */
export default function versioned(
  router: Object,
  options: Object = {}
): (Object, Function) => void {
  let current_version = options.hasOwnProperty("current_version")
    ? options.current_version
    : require(`${process.cwd()}/package.json`).version;

  let supported_versions = options.hasOwnProperty("supported_versions")
    ? options.supported_versions
    : false;

  let globPath;
  if (options.hasOwnProperty("glob")) {
    globPath = options.glob;
  } else {
    let basePath = options.hasOwnProperty("base_path")
      ? options.base_path
      : `${process.cwd()}/endpoints`;
    globPath = `${basePath}/v*`;
  }

  let versioned_directories = glob.sync(
    globPath,
    options.hasOwnProperty("glob_options") ? options.glob_options : {}
  );

  versioned_directories.forEach((dirname: string): void => {
    console.log(`versioned \tScanning directory: ${dirname}`);
    let endpoints = glob.sync(`${dirname}/**/*.js`);
    let v = dirname.split("/").pop();
    endpoints.forEach((file: string) => {
      console.log(`versioned \tRegistering endpoint: ${file}`);
      let routes = require(file).default;
      let route_prefix = options.hasOwnProperty("route_prefix")
        ? options.route_prefix
        : "";

      if (semver.satisfies(current_version, v)) {
        routes(router, prefixify(`${route_prefix}`));
      } else {
        routes(router, prefixify(`${route_prefix}/${v}`));
      }
    });
  });

  return async (ctx, next) => {
    await router.routes()(ctx, async () => {
      await router.allowedMethods()(ctx, next);
    });
  };
}

/**
 * Returns a function that prepares a versioned API endpoint path
 */
export function prefixify(prefix: string): string {
  return (path: string) => {
    return `${prefix}${path}`;
  };
}
