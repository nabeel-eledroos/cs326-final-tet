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

## Front End Implementation


## Deployment
