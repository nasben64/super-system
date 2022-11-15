# create .env files

To run the project we need to setup the environment variables, so please create two files:
.env.test which should have PGDATABASE= to point to the test database
.env.development which should have PGDATABASE= to point to the development database

# GET /api/categories

end point will list you al of the categories as an array of objects with the properies of

- slug
- description

# GET /api/reviews

end point with return an array of reviews objects with the following properies:

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
