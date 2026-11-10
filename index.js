import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * @typedef {object} CooldownOptions
 * @prop {string} [fileName = 'deps.json'] Dependency file name.
 * @prop {string[]} [directories = ['..', '../..']] Directories to look for fileName.
 * @prop {number} [defaultCooldown = 7] Non-local packages should cool down this long.
 * @prop {number} [localCooldown = 0] Local packages should coold down this long.
 * @prop {string | null} [key = 'local'] Key in dependency file holding array of local package names.
 * @prop {boolean} [verbose = false] Verbose logging.
 */

/**
 * Returns a promise for a function that sets cooldown days for local packages
 * differently than other packages.
 *
 * @param {CooldownOptions} [options = {}] Options.
 * @returns {Promise<(package: string) => number>} Cooldown function.
 */

export async function localCooldown(options = {}) {
  /** @type {Required<CooldownOptions>} */
  const opts = {
    fileName: 'deps.json',
    directories: ['..', '../..'],
    defaultCooldown: 7,
    localCooldown: 0,
    key: 'local',
    verbose: false,
    ...options,
  }
  let localSet = new Set();
  try {
    const names = opts.directories.map(d => path.join(d, opts.fileName));
    const deps = await Promise.any(names.map(n => fs.readFile(n, 'utf8')));
    let local = JSON.parse(deps);
    if (opts.key) {
      local = local[opts.key];
    }
    localSet = new Set(local);
  } catch (errs) {
    const ae = /** @type {AggregateError} */ (errs);
    const badErrs = ae.errors.filter((e) => e.code !== "ENOENT");
    switch (badErrs.length) {
      case 0:
        break;
      case 1:
        throw badErrs[0];
      default:
        throw new AggregateError(badErrs, "Error finding dependencies", {
          cause: errs,
        });
    }
  }
  return packageName => {
    const isLocal = localSet.has(packageName);
    if (opts.verbose) {
      console.error(`\n${packageName} local: ${isLocal}`)
    }
    return isLocal ? opts.localCooldown : opts.defaultCooldown;
  };
}
