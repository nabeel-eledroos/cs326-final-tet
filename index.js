'use strict';

require('dotenv').config();

const express = require('express');
const expressSession = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 8000;
app.use(express.static('public'));

const fs = require('fs');
const datafile = './fake_data.json';
const users = require(datafile);
const config = require("./config.json");
const { RSA_NO_PADDING } = require('constants');

const session = {
    secret: process.env.SECRET || config.SECRET,
    resave: false,
    saveUninitialized: false
};

// Strategy for user authentication
const strategy = new LocalStrategy(
    async(id, password, done) => {
        if(!findUser(id)) {
            return done(null, false, { 'message': 'Wrong username' });
        }
        if(!validatePassword(id, password)) {
            await new Promise((r) => setTimeout(r, 2000));
            return done(null, false, { 'message': 'Wrong password' });
        }
        return done(null, id);
    }
);

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use(express.json());
app.use(express.urlencoded({ 'extended': true }));

// error handler that sends why request failed.
function signUpErrHandler(err, req, res, next) {
    res.send({error: err});
}
app.use(signUpErrHandler);

// find if user exists. returns true if so. 
// TODO: Wire for db
function findUser(email) {
    return users.some(user => user.email === email);
}

// find if user exists, checks password, returns true if correct password
// TODO: Wire for db
function validatePassword(username, password) {
    if(!findUser(username)) {
        return false;
    } else {
        return users.some(user => {
            if(user.email === username) {
                return user.password === password;
            }
            return false;
        });
    }
}

// adds user to database if they do not exist already
function addUser(user) {
    if(findUser(user.email)) {
        return false;
    } else {    
        users.push(user);
        fs.writeFile(datafile, JSON.stringify(users), err => {
            if (err) {
                console.err(err);
            }
        });
        return true;
    }
}

app.get('/', (req, res) => res.sendFile('/index.html'));

/****** User signup requests ******/
// Sends back html file to load
app.get('/signup', (req, res) =>
        res.sendFile('/public/signup/sign_up.html', 
                    { 'root': __dirname }));

/**
 * Takes post request from client signup and adds them to the user list.
 */
app.post('/signup', 
    (req, res, next) => {
        if(!req.body.id || !req.body.password) {
            next('User Credentials are blank!');
        } else {
            const newUser = {
                name: req.body.name,
                email: req.body.id,
                password: req.body.password,
                interests: req.body.interests,
                charities: req.body.charities
            };
            if(addUser(newUser)) {
                res.send('success');
            } else {
                next('An account already exists under this email!');
            }
        }
    });

/****** User signin requests ******/
// Checks if user is authenticated, if so calls next to do next action.
// If not, the error handler is called.
function checkLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        next('User must log in first!');
    }
}

// Request for sign in page. Sends html to load
app.get('/signin',
    (req, res) =>  res.sendFile('/public/signin/sign_in.html', { 'root': __dirname }));

// Request to sign in, redirects to app on success, back to signin on failure
app.post('/signin',
        passport.authenticate('local', {
            'successRedirect' : '/private',
            'failureRedirect' : '/signin'
        }));

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/private',
    checkLoggedIn,
    (req, res) => {
        res.redirect('/private/' + req.user);
    });

app.get('/private/:userID/',
    checkLoggedIn,
    (req, res) => {
        if(req.params.userID === req.user) {
            res.sendFile(__dirname + '/public/app/app.html')
        }
    }
);

app.get('/my_account', 
    checkLoggedIn,
    (req, res) => res.redirect('/public/' + req.user + 'my_account'));

app.get('/private/:userID/my_account', 
    (req, res) => res.sendFile(__dirname + '/public/user_account/my_account.html'));

app.get('/userInfo', 
    checkLoggedIn, 
    (req, res) => res.redirect('/private/' + req.user + '/userInfo'))

app.get('/private/:userID/userInfo',
    checkLoggedIn,
    (req, res) => {
        const userInfo = users.filter((user) => {
            return user.email === req.user;
        });
        res.status(200).send(userInfo);
    }
);

app.get('/changePassPage', 
    checkLoggedIn,
    (req, res) => res.redirect('/private/' + req.user + '/change')
);

app.get('/private/:userID/change',
    checkLoggedIn,
    (req, res) => res.sendFile(__dirname + '/public/user_account/change_pass.html'));

app.post('/changePass', 
    checkLoggedIn,
    (req, res, next) => {
        users.forEach(user => {
            if (user.email === req.user) {
                if (user.password === req.body.cpass) {
                    user.password = req.body.npass;
                }
            }
        });
        fs.writeFile(datafile, JSON.stringify(users), err => {
            if (err) {
                console.err(err);
                next(err);
            }
        });
        res.redirect('/signin')
    });

app.get('/closeAccount', 
    checkLoggedIn, 
    (req, res) => res.redirect('/private/' + req.user + '/closeAccount'));

app.get('/private/:userID/closeAccount', 
    checkLoggedIn, 
    (req, res) => {
        if(req.params.userID === req.user) {
            const userInfoIndex = users.findIndex((user) => user.email === req.user);
            users.splice(userInfoIndex, userInfoIndex >= 0 ? 1 : 0);
            fs.writeFile(datafile, JSON.stringify(users), err => {
                if (err) {
                    console.err(err);
                }
            });
        }
        res.redirect('/logout');
    });


/****** External API requests ******/

/**
 * Get Top articles from NYTimes API, according to specific category
 */
app.get('/topStories', async function(req, res) {
    try {
        // For now, getting articles on the home page.
        const path = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${config._nytKey}`;
        fetch(path)
        .then(res => res.json())
        .then(data => {
            res.send(JSON.stringify(data));
        })
        .catch(err => {
            res.send(err);
        });
    } catch(e) {
        res.status = 405;
        res.send({
            'status': e
        });
    }
});

/**
 * Get Most Popular articles from NYTimes API
 */
app.get('/mostPopular', async function(req, res) {
    try {
        const path = `https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=${config._nytKey}`;
        fetch(path)
        .then(res => res.json())
        .then(data => {
            res.send(JSON.stringify(data));
        })
        .catch(err => {
            res.send(err);
        });
    } catch(e) {
        res.status = 405;
        res.send({
            'status': e
        });
    }
});

/**
 * Get all charities from charity nav
 */
app.get('/charities', async function(req, res) {
    try {
        const path = `https://api.data.charitynavigator.org/v2/Organizations?app_key=${config._charityKey}&app_id=${config._charityId}`;
        fetch(path)
        .then(res => res.json())
        .then(data => {
            res.send(JSON.stringify(data));
        })
        .catch(err => {
            res.send(err);
        });
    } catch(e) {
        res.status = 405;
        res.send({
            'status': e
        });
    }
});

app.get('*', (req, res) => {
    res.status(404);
    res.send('request does not exist.');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});