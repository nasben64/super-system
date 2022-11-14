const request = require("supertest");
const app = require("../app");
const {
  categoryData,
  reviewData,
  userData,
  commentData,
} = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const { TestWatcher } = require("jest");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("3. GET /api/categories", () => {
  test("GET : 200,  get all categories should return all category objects ", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        res.body.forEach((element) => {
          expect(element).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("GET : 200,  retruns a length of 4", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(4);
      });
  });
  test("GET : 404,  returns not found when sent invalid endpoint", () => {
    return request(app)
      .get("/api/categorie")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});
