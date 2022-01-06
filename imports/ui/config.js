import { Meteor } from 'meteor/meteor';

/**
 * Implements frontend configuration using a hosted config.json file.
 */
export class Config {
  cache = undefined;
  url = undefined;

  /**
   * Construct new frontend configuration instance.
   *
   * @param {string} url Absolute URL to config.json. Defaults to /config.json
   *                     relative to meteor base URL.
   */
  constructor(url = undefined) {
    if (url === undefined) {
      const base = Meteor.absoluteUrl();
      this.url = (new URL("config.json", base)).toString();
    }
  }

  /**
   * Fetch frontend configuration.
   *
   * @returns An object representing the configuration.
   */
  async fetch() {
    if (this.cache === undefined) {
      const response = await fetch(this.url);
      if (response.status == 200) {
        this.cache = await response.json();
      }
      else {
        console.warn(`Failed to fetch config from ${this.url}`);
      }
    }

    return this.cache;
  }
}

let c = undefined;

/**
 * Return default frontend configuration instance.
 *
 * Usage example (in async function):
 *
 *    const c = await defaultConfig().fetch();
 *    // Do something with values from c.
 *
 * Usage example (using promises):
 *
 *    defaultConfig().fetch().then(function(c) {
 *      // Do something with values from c.
 *    });
 *
 * @returns Default frontend configuration.
 */
export function defaultConfig() {
  if (c === undefined) {
    c = new Config();
  }
  return c;
}
