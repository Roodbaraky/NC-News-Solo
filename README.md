# Northcoders News API

In order to run this API locally:
-create two .env files for test and development respectively (e.g. '.env.test')
-within these files add the following: 'PGDATABASE=<database_name>' e.g. 'PGDATABASE=nc_news_test'for test data


GET /api:
- returns an object of the available endpoints with descriptions of their available methods, queries, example responses etc.

GET /api/topics:
-returns an array of all the topic objects with slug and description properties

GET /api/articles/:article_id:
-returns an article object corresponding to the article_id passed as a parameter