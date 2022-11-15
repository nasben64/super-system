const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

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
      .then(({ body }) => {
        body.categories.forEach((category) => {
          expect(category).toMatchObject({
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
      .then(({ body }) => {
        expect(body.categories).toHaveLength(4);
      });
  });
  test("GET : 404,  returns not found when sent invalid endpoint", () => {
    return request(app)
      .get("/api/category")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("4. GET /api/reviews", () => {
  test("GET : 200,  get all reviews should return all review objects ", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            category: expect.any(String),
            review_img_url: expect.any(String),
            review_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("GET - 200, should return the owner propery", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
          });
        });
      });
  });
  test("GET - 200 returns the comment_count of '3' for review_id 2 and 3", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        body.reviews.forEach((review) => {
          if (review.review_id === 2 || review.review_id === 3) {
            expect(review.comment_count).toBe("3");
          }
        });
      });
  });
  test("GET - 200 should be sorted by the date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET : 404,  returns not found when sent invalid endpoint", () => {
    return request(app)
      .get("/api/review")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("5. GET /api/reviews/:review_id", () => {
  test("GET-200 returns a review object for the passed review_id", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.review[0]).toMatchObject({
          review_id: expect.any(Number),
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test("GET 200 - the review_id in the review object should be equal to the passed review_id", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.review[0]).toMatchObject({
          review_id: 2,
        });
      });
  });
  test("GET:404 sends review does not exist error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/reviews/99")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review does not exist");
      });
  });
  test("GET:400 sends Bad Request error message when given an invalid id", () => {
    return request(app)
      .get("/api/reviews/abc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
