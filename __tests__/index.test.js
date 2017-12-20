const request = require("supertest");
const path = require("path");
const fs = require("fs");

const app = require("./app");

describe("Test the root path", () => {
  let server = null;

  beforeAll(() => {
    server = app.listen(8080);
  });

  afterAll(() => {
    server.close();
  });

  test("should response code 200", () =>
    request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);

        return Promise.resolve();
      }));

  const fixtureDir = path.join(__dirname, "fixtures");
  // eslint-disable-next-line no-sync
  const suiteTests = fs.readdirSync(fixtureDir);

  suiteTests.forEach(suiteTest => {
    test(`should response code 200 and rewrite in '${suiteTest}'`, () =>
      request(app)
        .get(`/${suiteTest}`)
        .set("Host", "127.0.0.1")
        .set("Accept", "text/html")
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.text).toMatchSnapshot();

          return Promise.resolve();
        }));
  });
});
