Install Dependencies: 
         `npm install express`
         `npm install express-session`
         `npm install dotenv`
         `npm install passport`
         `npm install passport-local`
         `npm install passport-strategy`
         `npm install node-fetch`

To run: 
    `npm start` or
    `npm run startMon` -> run with nodemon

External APIs: 
    -New York Times: Make developer account and get an API key and add Most Popular API to account's APIs
    -Charity Navigator: Make developer account and get an API key

Heroku Deployment:
    Set up application to be hosted on Heroku
        -Heroku Addons: Heroku Postgres, database for users
        -Heroku Vars: API Keys for external APIs (NYTimes and Charity Navigator), Production, and Secret for sessions
    

