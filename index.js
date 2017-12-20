"use strict";

const url = require("url");
const restModifier = require("resp-modifier");

function rewriteLinksModifierCreate(originalURL) {
  const parsedOriginalURL = url.parse(originalURL);
  const originalHost = parsedOriginalURL.hostname;
  const originalPort = parsedOriginalURL.port;
  let fullOriginalURL = originalHost;

  if (originalHost && originalPort) {
    if (parseInt(originalPort, 10) !== 80) {
      fullOriginalURL = `${originalHost}:${originalPort}`;
    }
  }

  return {
    fn(req, res, match) {
      const requestHost = req.headers.host;
      let mathed = match;

      /**
       * Reject subdomains
       */
      if (mathed[0] === ".") {
        return mathed;
      }

      const captured = mathed[0] === "'" || mathed[0] === '"' ? mathed[0] : "";

      /**
       * allow http https
       * @type {string}
       */
      const pre = "//";

      if (mathed[0] === "'" || mathed[0] === '"') {
        mathed = mathed.slice(1);
      }

      /**
       * parse the url
       * @type {number|*}
       */
      const out = url.parse(mathed);

      /**
       * If host not set, just do a simple replace
       */
      if (!out.host) {
        fullOriginalURL = fullOriginalURL.replace(/^(\/)/, "");

        return captured + mathed.replace(fullOriginalURL, requestHost);
      }

      /**
       * Only add trailing slash if one was
       * present in the original mathed
       */
      let path = out.path || "";

      if (path === "/") {
        if (mathed.slice(-1) === "/") {
          path = "/";
        } else {
          path = "";
        }
      }

      let port = "";

      if (out.port && parseInt(out.port, 10) !== 80) {
        port = `:${out.port}`;
      }

      let hash = "";

      if (out.hash) {
        ({ hash } = out);
      }

      /**
       * Finally append all of parsed url
       */
      return [captured, pre, requestHost, port, path, hash].join("");
    },
    match: new RegExp(
      `https?:\\\\/\\\\/${fullOriginalURL}|('|")\\/\\/${fullOriginalURL}|https?://${fullOriginalURL}(/)?|('|")(https?://|/|\\.)?${fullOriginalURL}(/)?(.*?)(?=[ ,'"\\s])`,
      "g"
    )
  };
}

module.exports = function createRewriteLinkMiddleware(options) {
  if (!options.originalURL) {
    throw new Error("Parameter 'originalURL' is required");
  }

  let originalURLs = options.originalURL;

  if (!Array.isArray(originalURLs)) {
    originalURLs = [originalURLs];
  }

  const rules = [];

  originalURLs.forEach(originalURL => {
    rules.push(rewriteLinksModifierCreate(originalURL));
  });

  return restModifier.create({
    blacklist: options.blacklist,
    hostBlacklist: options.hostBlacklist,
    ignore: options.ignore,
    rules,
    whitelist: options.whitelist
  }).middleware;
};
