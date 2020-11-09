## API Planning

### New York Times API

In order to get an API key, we first have to make a developer account and register our app. This key has a limit of 4,000 requests per day, and 10 requests per minute, which we think we will always stay under. With this API, there are a few endpoints we are most interested in:

1. Most Popular

    This endpoint provides a json array with the most popular articles based on a defined metric (emails, shares, or views) and a specified time period (1, 7, or 30 days).

    Example - getting the most viewed NYT articles in the past day:

    `HTTP GET https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=yourkey`

    Example Response (some fields removed for the sake of brevity):

    ```
    {
        "status": "OK",
        "copyright": "Copyright (c) 2020 The New York Times Company.  All Rights Reserved.",
        "num_results": 20,
        "results": [
            {
                "uri": "nyt://article/8032db8d-078d-5433-b925-f5e7c0764a6b",
                "url": "https://www.nytimes.com/2020/11/03/us/politics/when-election-results.html",
                "id": 100000007428149,
                "source": "New York Times",
                "published_date": "2020-11-03",
                "updated": "2020-11-04 13:45:21",
                "section": "U.S.",
                "subsection": "Politics",
                "nytdsection": "u.s.",
                "adx_keywords": "Absentee Voting;Polls and Public Opinion;Electoral College;Presidential Election of 2020;Trump, Donald J;Biden, Joseph R Jr",
                "column": null,
                "byline": "By The New York Times",
                "type": "Article",
                "title": "When Will We Know the Election Results?",
                "abstract": "We don’t have a crystal ball. But here’s what we know about timing for election night.",
                "des_facet": [
                    "Absentee Voting",
                    "Polls and Public Opinion",
                    "Electoral College",
                    "Presidential Election of 2020"
                ],
                "per_facet": [
                    "Trump, Donald J",
                    "Biden, Joseph R Jr"
                ]
            }, 19 more results...]
    }
    ```

2. Top Stories

    Provides json array with the top stories from a specific section (arts, automobiles, books, business, fashion, food, health, home, insider, magazine, movies, nyregion, obituaries, opinion, politics, realestate, science, sports, sundayreview, technology, theater, t-magazine, travel, upshot, US, and world). Home returns all articles on the homepage.

    Example - getting the top stories in the US today:

    `HTTP GET https://api.nytimes.com/svc/topstories/v2/us.json?api-key=yourkey`

See here for more: [NYT API Documentation](https://developer.nytimes.com/apis)

### Charity Navigator Data API

Similar to the NYT API, we have to create an account and register our app, and then we can receive an API key.

The main endpoint we will be working with is **Organizations**. This provides a list of all charity organizations in the database, and has a variety of search options to filter the results.

Example - getting all organizations currently in the database:

`HTTP GET https://api.data.charitynavigator.org/v2/Organizations`

Example response:

```
[
  {
    "charityNavigatorURL": "https://www.charitynavigator.org/?bay=search.summary&orgid=5954&utm_source=DataAPI&utm_content=b16336bb",
    "mission": "The MDI Biological Laboratory is a rapidly growing, independent non-profit biomedical research institution. Its mission is to improve human health and well-being through basic research, education, and development ventures that transform discoveries into cures.",
    "websiteURL": "http://www.mdibl.org/",
    "tagLine": "Connecting Science, Environment, and Health",
    "charityName": "Mount Desert Island Biological Laboratory",
    "ein": "010202467",
    "orgID": 5954,
    "currentRating": {
      "score": 94.62,
      "ratingID": 122841,
      "publicationDate": "2017-07-01T04:00:00.000Z",
      "ratingImage": {
        "small": "https://d20umu42aunjpx.cloudfront.net/_gfx_/icons/stars/4starsb.png",
        "large": "https://d20umu42aunjpx.cloudfront.net/_gfx_/icons/stars/4stars.png"
      },
      "rating": 4,
      "financialRating": {
        "score": 93.54,
        "rating": 4
      },
      "accountabilityRating": {
        "score": 96,
        "rating": 4
      }
    },...
```

See here for more: [Charity Navigator API Documentation](https://charity.3scale.net/docs/data-api/reference)

### Charity-Match API (Our site)

1. Getting homepage:

  Request: `HTTP GET https://charity--match.herokuapp.com/`

  Accessing the website sends a GET request to the server. The server handles this under the '/' request, which sends the client the landing page to load.

2. Signing Up with Charity Match

  Request: `HTTP GET/POST https://charity--match.herokuapp.com/signup`

  The GET request, https://charity--match.herokuapp.com/signup, returns the page to load. 
  
  The POST request to https://charity--match.herokuapp.com/signup adds a user to the database. The request is formatted as so:
                          { 
                            first_name: req.body.first_name, 
                            last_name: req.body.last_name, 
                            id: req.body.id, 
                            password: req.body.password,
                            interests: req.body.interests,
                            charities: req.body.charities
                          };
  }
  On success, the server redirects the user to https://https://charity--match.herokuapp.com/signin where they server will respond with the signin page.

3. Signing into Charity Match Account: 

  Request: `HTTP GET/POST https://https://charity--match.herokuapp.com/signin`

  The GET request is handled by the server responding with the page to load.
  
  The POST request to https://https://charity--match.herokuapp.com/signin reads from the database to see if the user has an account. On success, the server redirects the client to https://https://charity--match.herokuapp.com/app, where the server responds with the user's personal webpage. On failure, the server sends a 400 response indicating what went wrong.

4. User's Charity-Match Home Page:

  Request: `HTTP GET https://https://charity--match.herokuapp.com/app`

  The client is redirected to make the GET request for the server to return the user's personal homepage. On failure, the server sends to the client a 400 status indicating a user has not been signed in. On load of the user's page, the client makes a GET request to the server responding with JSON of of the top news and most popular stories from the New York Times API, as described above.

5. Logging Out:

  Request: `HTTP GET https://https://charity--match.herokuapp.com/logout`

  The GET request has the server destroy the user session and redirecting them to https://https://charity--match.herokuapp.com/, where the server will send them back the landing page.

6. User's Account Page: 

  Request: `HTTP GET https://https://charity--match.herokuapp.com/account`

  The GET request returns the user's information as JSON. The information is retrieved based on the user that is signed in. The information is structured as:
                        {
                          "first_name": Jeff,
                          "last_name": Jon,
                          "email":"MyNameisJeff@hotmail.com",
                          "password":"BT0Wr7sMUwmK9vo",
                          "interests": ["deforestation", "disasterRelief"],
                          "charities": ["GoFundMe", "Wounded Warrior"]
                        }

7. Close User Account: 
  
  Request: `HTTP GET https://https://charity--match.herokuapp.com/account` 

  The server handles this by checking to see if the user that wants to close the account is logged in. If so, it finds the user's information, and deletes it from the database, then redirects the client to https://https://charity--match.herokuapp.com/logout.

8. Getting Top Stories:

  Request: `HTTP GET  https://https://charity--match.herokuapp.com/topStories`

  The server reaches out to the New York Times API by making a GET request to the API, as described above. The data retrieved will be JSON which gets sent back to the client as JSON.

9. Getting Most Popular Stories: 
  Request: `HTTP GET  https://https://charity--match.herokuapp.com/mostPopular`

  The server reaches out to the New York Times API, making a get request to the Most Popular API, as described above. The data retrieved will be JSON, in the format described prior, and be sent to the client as JSON.

10. Any other request:

  The server responds with a status of 404 and a message.

### Front End Implementation with CRUD
  1. CREATE

    image: https://github.com/nabeel-eledroos/cs326-final-tet/blob/master/CRUD%20Screenshots/CREATE.png

    The client renders the signup page which allows the user to create an account. The account information supplied will be sent to the server for them to be added if they account does not already exist under that email. The client sends the info in a POST request to the server, in the format: 
                        {
                          "first_name": Jeff,
                          "last_name": Jon,
                          "email":"MyNameisJeff@hotmail.com",
                          "password":"BT0Wr7sMUwmK9vo",
                          "interests": ["deforestation", "disasterRelief"],
                          "charities": ["GoFundMe", "Wounded Warrior"]
                        }

  2. READ

    image: https://github.com/nabeel-eledroos/cs326-final-tet/blob/master/CRUD%20Screenshots/READ.png

    The client renders the signin page sent by the server, which gives a user the ability to login. The client will make a POST request with the user's email and password. The format is: 
    
                        {
                          "id": "username", 
                          "password": "password"
                        };

    The id is the user's email, which is also their username. The server will take this info and read from the database to see if the user exists. If so, the server will respond with webpage specific to the user.

  3. UPDATE

    image: 


  4. DELETE

    image:




### Deployment

Heroku: [https://charity--match.herokuapp.com](https://charity--match.herokuapp.com)


### Division of Labor

