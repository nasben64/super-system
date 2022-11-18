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

describe("6. GET /api/reviews/:review_id/comments", () => {
  test("GET-200 returns an array of comments object for the passed review_id and check that the passed review_id is returned with the object", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 2,
          });
        });
      });
  });
  test("GET-200 return the comments object sorted in a descending order", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET- 200 returns an empty array when given a valid but non-existent id in the comments table", () => {
    return request(app)
      .get("/api/reviews/9/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("GET-400 sends Bad Request error message when given an invalid id (i.e. abc)", () => {
    return request(app)
      .get("/api/reviews/abc/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET- 404 sends review not found! when the there is no review matches the review_id passed", () => {
    // test for the review exists
    return request(app)
      .get("/api/reviews/99/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review not found!");
      });
  });
});

describe("7. POST /api/reviews/:review_id/comments", () => {
  test("POST - 201 should return the new comment", () => {
    const newComment = {
      body: "Great game enjoyed by all the family aged 4 to 68",
      username: "dav3rid",
    };
    return request(app)
      .post("/api/reviews/6/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 7,
          review_id: 6,
          author: "dav3rid",
          votes: expect.any(Number),
          body: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test("GET- 404 sends review not found! when the there is no review matches the review_id passed", () => {
    const newComment = {
      body: "Great game enjoyed by all the family aged 4 to 68",
      username: "dav3rid",
    };
    return request(app)
      .post("/api/reviews/99/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review not found!");
      });
  });
  test("POST:400 responds with an appropriate error message when provided with no 'body'", () => {
    const newComment = {
      username: "dav3rid",
    };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST:400 responds with an appropriate error message when provided with no 'username'", () => {
    const newComment = {
      body: "Great game enjoyed by all the family aged 4 to 68",
    };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST:404 responds with an appropriate error message when provided with incorrect username", () => {
    const newComment = {
      body: "Great game enjoyed by all the family aged 4 to 68",
      username: "non-existent",
    };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user not found!");
      });
  });
});
describe("8. PATCH /api/reviews/:review_id", () => {
  test("PATCH - 200 returns the updated review object with the votes property updated to the correct value", () => {
    const reviewObj = { inc_votes: 10 };
    return request(app)
      .patch("/api/reviews/2")
      .send(reviewObj)
      .expect(200)
      .then(({ body }) => {
        expect(body.review[0].votes).toBe(15);
        expect(body.review[0]).toMatchObject({
          review_id: 2,
          title: expect.any(String),
          category: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_body: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: 15,
        });
      });
  });
  test("PATCH - 200 should decrement the votes property when passed a nigetive number", () => {
    const reviewObj = { inc_votes: -10 };
    return request(app)
      .patch("/api/reviews/2")
      .send(reviewObj)
      .expect(200)
      .then(({ body }) => {
        expect(body.review[0].votes).toBe(-5);
      });
  });
  test("PATCH - 400 responds with inc_votes can not be undefined message when provided with no inc_vote value", () => {
    const newComment = {};
    return request(app)
      .patch("/api/reviews/2")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("inc_votes can not be undefined");
      });
  });
  test("PATCH - 404 sends review does not exist error message when given a valid but non-existent id", () => {
    const newComment = { inc_votes: 10 };
    return request(app)
      .patch("/api/reviews/99")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review not found!");
      });
  });
  test("PATCH:400 sends Bad Request error message when given an invalid inc_votes datatype ", () => {
    const newComment = { inc_votes: "abc" };
    return request(app)
      .patch("/api/reviews/2")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
describe("9. GET /api/users", () => {
  test("GET: 200, returns an array of reviews objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("GET : 200,  return a length of 4", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
      });
  });
  test("GET : 404,  returns not found when sent invalid endpoint", () => {
    return request(app)
      .get("/api/user")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("10. GET /api/reviews/:review_id (comment count)", () => {
  test("GET-200 returns a review object for the passed review_id and includes the coumment_count", () => {
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
          comment_count: "3",
        });
      });
  });
});
