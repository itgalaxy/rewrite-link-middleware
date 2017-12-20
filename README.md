# rewrite-link-middleware

[![NPM version](https://img.shields.io/npm/v/rewrite-link-middleware.svg)](https://www.npmjs.org/package/rewrite-link-middleware)
[![Travis Build Status](https://img.shields.io/travis/itgalaxy/rewrite-link-middleware/master.svg?label=build)](https://travis-ci.org/itgalaxy/rewrite-link-middleware)
[![dependencies Status](https://david-dm.org/itgalaxy/rewrite-link-middleware/status.svg)](https://david-dm.org/itgalaxy/rewrite-link-middleware)
[![devDependencies Status](https://david-dm.org/itgalaxy/rewrite-link-middleware/dev-status.svg)](https://david-dm.org/itgalaxy/rewrite-link-middleware?type=dev)
[![Greenkeeper badge](https://badges.greenkeeper.io/itgalaxy/rewrite-link-middleware.svg)](https://greenkeeper.io)

Returns Express middleware that serves a service worker that resets any previously set service worker configuration. Useful for development.

Example you development site on `127.0.0.1:3000` and have `html`:

```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <a href="http://example.com/my/url">Link</a>
  </body>
</html>
```

Using this middleware you will get:

```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <a href="//127.0.0.1:3000/my/url">Link</a>
  </body>
</html>
```

## Installation

```shell
npm i -D rewrite-link-middleware
```

## API

```js
const createRewriteLinkMiddleware = require("rewrite-link-middleware");
```

### createRewriteLinkMiddleware(options)

Returns Express middleware that rewrite links in response.

#### Options

##### originalURL

Original URL hat you use in html document.

```js
createRewriteLinkMiddleware({ originalURL: "http://example.com" });
```

```js
createRewriteLinkMiddleware({
  originalURL: ["http://example.com", "http://another-example.com"]
});
```

##### Other

See [other options](https://github.com/shakyShane/resp-modifier/blob/master/index.js#L10)

## Examples

Simple app:

```js
const express = require("express");
const createRewriteLinkMiddleware = require("rewrite-link-middleware");

const app = express();

app.use(createRewriteLinkMiddleware({ originalURL: "http://example.com" }));

app.get("/", function(req, res) {
  res.sendFile("index.html");
});
```

[webpack-dev-server](https://github.com/webpack/webpack-dev-server):

```js
const createRewriteLinkMiddleware = require("rewrite-link-middleware");

module.exports = {
  // ...
  devServer: {
    before(app, server) {
      app.use(
        createRewriteLinkMiddleware({ originalURL: "http://example.com" })
      );
    }
    // ...
  }
  // ...
};
```

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
