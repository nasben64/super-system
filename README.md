# create .env files

To run the project we need to setup the environment variables, so please create two files:
.env.test which should have PGDATABASE= to point to the test database
.env.development which should have PGDATABASE= to point to the development database

# 3) GET /api/categories

This end point will list you all of the categories as an array of objects with the properies of

- slug
- description

# 4) GET /api/reviews

This end point with return an array of reviews objects with the following properies:

- owner which is the username for the user table
- title
- review_id
- category
- review_img_url
- created_at
- votes
- designer
- comment_count which is the total counts of all commnts for a particular review_id
  Also the returned array of reviews is sorted by the created_at field in a descending order.

# 5) GET /api/reviews/:review_id

This end point returns a review object for a given review_id with the following properties

- review_id
- owner
- title
- review_body
- category
- review_img_url
- created_at
- votes
- designer

# 6) GET /api/reviews/:review_id/comments

This end point returns an array of comments object for a given review_id and should have the following properties:

- comment_id
- votes
- created_at
- author
- body
- review_id
  The comments array of objects will be sorted by the created_at in a desending order.

# 7) POST /api/reviews/:review_id/comments

This end point updates the comments table by passing an object with the following properites

- username which is the auther
- body
  the response would be the newly added comment object
