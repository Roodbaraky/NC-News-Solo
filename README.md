# Northcoders News API
## Summary
The Northcoders News (NC News) API is a back-end interface built to power a reddit-like news app: NC News.
The API is built using the Express.js and Node.js frameworks and is powered by a PostgreSQL database in conjunction with ElephantSQL and Render for live hosting.


## Local Setup

### Clone the repo

```
git clone https://github.com/Roodbaraky/NC-News-Solo
```
- Clone the repo into your chosen directory via the above command.

### ENV setup
```
PGDATABASE=nc_news_test
```
```
PGDATABASE=nc_news
```
- create two .env files for test and development respectively
- within these files add the line corresponding to each database


### Install

```
npm install 
```
- run the previous to ensure all necessary dependencies are installed

### Setup Database
```
npm setup-dbs
```
```
npm seed
```
- run the previous in order to create and seed the databases 

### Run the app

```
listen.js
```

### Run tests

```
npm test
```

### Requirements
- in order to run locally you will need
- node version 21.7.1 or later
- psql version 16.2 or later

## Hosted App
Go to
```
https://nc-news-solo-kr.onrender.com/
```
- this will present with a 404 at the '/' path
- please make a request such as GET /api to view the available endpoints

# NC News
The RESTful API for NC News is accessed as follows:

## Get available endpoints
##### Request
```
GET /api
```
- returns an object of the available endpoints with descriptions of their available methods, queries, example responses etc.
### Get users
##### Request
```
GET /api/users
```
- returns an array of all the user objects.

### Get topics
##### Request
```
GET /api/topics
```
- returns an array of all the topic objects with slug and description properties.

### Get articles
##### Request
```
GET /api/articles
```
- returns an array of all article objects. 

#### Get articles by id
##### Request
```
GET /api/articles/:article_id
```
- returns an article object corresponding to the article_id passed as a parameter.


#### Get comments by (article) id
##### Request
```
GET /api/articles/:article_id/comments
```
- returns an array containing comment objects corresponding to the article_id passed as a parameter.

### Post a comment to an article
##### Request
```
POST /api/articles/:article_id/comments
```
- adds a comment object with username and body to the comments table returning the object with a serialised comment_id and constituent properties

### Delete a comment
##### Request
```
DELETE /api/comments/:comment_id
```
- deletes the comment corresponding to the comment_id supplied.

### Edit an article
##### Request
```
PATCH /api/articles/:article_id
```
- updates the properties of an article corresponding to the article_id. Properties are updated according to the object sent in the request body (currenlty in the form { inc_votes: newVote }, where newVote can be a postive or negative integer)

