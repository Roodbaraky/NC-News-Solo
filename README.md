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
The RESTful API for NC News can be used as follows:

## Get available endpoints
##### Request
```
GET /api
```
- returns an object of the available endpoints with descriptions of their available methods, queries, example responses etc.
- from here, you can use the api to perform various functions, as detailed below


## Retrieve data
- all primary endpoints, with the exception of *'/comments'* have a *'Get All' * method, which allows you to retrieve all the data from respective tables.
- secondary parametric endpoints, again, with the exception of *':/comment_id'*, allow you to retrieve all the properties of the object/s corresponding to the inputted identifier.

## Update data
- some data can be amended and updated via **PATCH**.
- this works by reading the properties of a valid passed object and updating the respective table values corresponding to object identified by the passed identifier.
- in this API, this is limited to incrementing/decrementing the number of votes on an article or comment via their respective identifier, intended to support upvote/downvote behaviours.

## Add data
- new data can be added to the *articles* and *comments* tables via **POST**.
- in this case, adding new articles and adding comments to articles is supported. 

## Remove data
- some data can be deleted from tables via **DELETE**.
- similarly, the articles and comments tables support deletion requests in order to allow for deleting articles and comments on articles.
- in the event an article is deleted from the articles table, the corresponding comments on said article are also deleted from the comments table

