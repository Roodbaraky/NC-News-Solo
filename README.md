# Northcoders News API

In order to run this API locally:
- create two .env files for test and development respectively (e.g. '.env.test')
- within these files add the following: 'PGDATABASE=<database_name>' e.g. 'PGDATABASE=nc_news_test'for test data


GET /api:
- returns an object of the available endpoints with descriptions of their available methods, queries, example responses etc.

GET /api/topics:
- returns an array of all the topic objects with slug and description properties

GET /api/articles
- returns an array of all article objects 

GET /api/articles/:article_id:
- returns an article object corresponding to the article_id passed as a parameter

GET /api/articles/:article_id/comments:
- returns an array containing comment objects corresponding to the article_id passed as a parameter

POST /api/articles/:article_id/comments:
- adds a comment object with username and body to the comments table returning the object with a serialised comment_id and constituent properties

PATCH /api/articles/:article_id:
- updates the properties of an article corresponding to the article_id. Properties are updated according to the object sent in the request body (currenlty in the form { inc_votes: newVote }, where newVote can be a postive or negative integer)

DELETE /api/comments/:comment_id
- deletes the comment corresponding to the comment_id supplied.