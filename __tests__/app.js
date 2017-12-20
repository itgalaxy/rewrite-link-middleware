const express = require("express");
const path = require("path");
const createRewriteLinkMiddleware = require("..");
const fs = require("fs");

const app = express();
const fixtureDir = path.join(__dirname, "fixtures");

app.use(
  createRewriteLinkMiddleware({
    originalURL: ["http://example.com", "http://another.com:8081"]
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// eslint-disable-next-line no-sync
const suiteTests = fs.readdirSync(fixtureDir);

suiteTests.forEach(suiteTest => {
  app.get(`/${suiteTest}`, (req, res) => {
    res.sendFile(path.join(fixtureDir, suiteTest));
  });
});

module.exports = app;
