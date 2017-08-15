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
  console.log("versioned \tInitializing...");

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

  console.log(`versioned \tSeeking endpoints matching ${globPath}`);
  let versioned_directories = glob.sync(
    globPath,
    options.hasOwnProperty("glob_options") ? options.glob_options : {}
  );

  versioned_directories.forEach((dirname: string): void => {
    if (fs.lstatSync(dirname).isDirectory()) {
      console.log(`versioned \tScanning directory: ${dirname}`);
      let endpoints = glob.sync(`${dirname}/**/*.js`);
      let v = dirname.split("/").pop();
      endpoints.forEach((file: string) => {
        if (!/.test.js/.test(file)) {
          console.log(`versioned \tRegistering endpoint: ${file}`);
          let routes = require(file).default;

          if (semver.satisfies(current_version, v)) {
            routes(router, apify);
          } else {
            routes(router, versionify(dirname));
          }
        }
      });
    }
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
export function versionify(prefix: string): string => string {
  return path => {
    return apify(`/${prefix}${path}`);
  };
}

/**
 * Returns a function that prepares a non-versioned API endpoint path
 */
export function apify(path: string): string {
  return `/api${path}`;
}
