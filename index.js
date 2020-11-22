'use strict';

require('dotenv').config();

const express = require('express');
const expressSession = require('express-session');
const fetch = require('node-fetch');
const app = express();
const flash = require('connect-flash');
app.use(flash());

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const minicrypt = require('./libs/miniCrypt');

const mc = new minicrypt();

const config = (process.env.PRODUCTION) ? {
    "PORT": process.env.PORT,
    "SECRET": process.env.SECRET,
    "_nytkey": process.env.NYTKEY,
    "_cnkey": process.env.CNKEY,
    "_cnid": process.env.CNID,
    "_dburl": process.env.DATABASE_URL
} : require("./config.json");

const session = {
    secret: config.SECRET,
    resave: false,
    saveUninitialized: false
};

// Strategy for user authentication
const strategy = new LocalStrategy(
    async(email, password, done) => {
        findUser(email)
            .then((data) => {
                if(mc.check(password, data.salt, data.password)) {
                    return done(null, email);
                } else {
                    return done(null, false, { 'message': 'Wrong username/password' });
                }
            })
            .catch(async (error) => {
                console.log(error);
                await new Promise((r) => setTimeout(r, 2000));
                return done(null, false, { 'message': 'Error internally. Please try again.' });
            });
    }
);

// PassportJS implementation for user auth
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

/** Database Wiring */
// DB connection
async function connectAndRun(task) {
    let connection = null;

    try {
        connection = await db.connect();
        return await task(connection);
    } catch (e) {
        throw e;
    } finally {
        try {
            connection.done();
        } catch(ignored) {
        }
    }
}

// Instantiate pg-promise with connect and disconnect inits
const pgp = require('pg-promise')({
    connect(client) {
        console.log('Connected to database:', client.connectionParameters.database);
    },

    disconnect(client) {
        console.log('Disconnected from database:', client.connectionParameters.database);
    }
});
const db = pgp(config._dburl);

// Find if user exists. returns true if so.
async function findUser(email) {
    return await connectAndRun(db => 
        db.one("SELECT * FROM users WHERE email = $1:csv;", email));
}

// adds user to database
async function addUser(user) {
    // Need to check if user exists?
    return await connectAndRun(db => 
        db.none("INSERT INTO users($1:name) VALUES ($1:csv);",
            // "INSERT INTO users(email, salt, password, name, interests, charities)\
            //     VALUES ($1, $2, $3, $4, $5, $6)", 
                [user] // [email, salt, password, name, interests[], charities[]]
        ));
}

app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile('/index.html'));

/****** User signup requests ******/
// Sends back html file to load
app.get('/signup', (req, res) =>
        res.sendFile('public/signup/sign_up.html', { 'root': __dirname }));

/**
 * Takes post request from client signup and adds them to the user list.
 */
app.post('/signup', 
    (req, res, next) => {
        if(!req.body.email || !req.body.password) {
            next('User Credentials are blank!');
        } else {
            const [salt, hash] = mc.hash(req.body.password);
            const newUser = {
                email: req.body.email,
                salt: salt,
                password: hash,
                name: req.body.name,
                interests: req.body.interests,
                charities: req.body.charities
            };
            addUser(newUser)
                .then(() => {
                    res.send('success');
                })
                .catch(() => {
                    next('An account already exists under this email!');
                });
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
        'failureRedirect' : '/signin',
        'failureFlash': true
    })
);

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
    (req, res, next) => {
        findUser(req.user)
            .then((data) => {
                res.send(JSON.stringify({
                    "name": data.name,
                    "email": data.email,
                    "interests": data.interests,
                    "charities": data.charities
                }));
            })
            .catch(() => {
                next("This account doesn't exist!");
            });
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
        const [salt, hash] = mc.hash(req.body.npass);
        connectAndRun(db =>  
            db.none(
                "UPDATE users \
                SET salt = $1:csv, \
                    password = $2:csv \
                WHERE email = $3:csv;", 
                [salt, hash, req.user]))
            .then(() => {
                res.redirect('/signin')
            })
            .catch(() => {
                next("This account doesn't exist!");
            });
        });

app.get('/closeAccount', 
    checkLoggedIn, 
    (req, res) => res.redirect('/private/' + req.user + '/closeAccount'));

app.get('/private/:userID/closeAccount', 
    checkLoggedIn, 
    (req, res, next) => {
        connectAndRun(db => db.none("DELETE FROM users WHERE email = $1:csv;", req.user))
        .then(() => {
            res.redirect('/logout');
        })
        .catch(() => {
            next("This account doesn't exist!");
        });
    });


/****** External API requests ******/

/**
 * Get Top articles from NYTimes API, according to specific category
 */
app.get('/topStories', async function(req, res) {
    // For now, getting articles on the home page.
    const path = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${config._nytkey}`;
    fetch(path)
    .then(res => res.json())
    .then(data => {
        res.send(JSON.stringify(data));
    })
    .catch(err => {
        res.send(err);
    });
});

/**
 * Get Most Popular articles from NYTimes API
 */
app.get('/mostPopular', async function(req, res) {
    const path = `https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=${config._nytkey}`;
    fetch(path)
    .then(res => res.json())
    .then(data => {
        res.send(JSON.stringify(data));
    })
    .catch(err => {
        res.send(err);
    });
});

/**
 * Get all charities by specific search from charity nav
 */
app.post('/charitySearch', async function(req, res) {
    const path = `https://api.data.charitynavigator.org/v2/Organizations?app_key=${config._cnkey}&app_id=${config._cnid}&search=${req.body.param}&pageSize=20`;
    fetch(path)
    .then(res => res.json())
    .then(data => {
        res.send(JSON.stringify(data));
    })
    .catch(err => {
        res.send(err);
    });
});

/**
 * Get all charities from charity nav
 */
app.get('/charities', async function(req, res) {
    const path = `https://api.data.charitynavigator.org/v2/Organizations?app_key=${config._cnkey}&app_id=${config._cnid}`;
    fetch(path)
    .then(res => res.json())
    .then(data => {
        res.send(JSON.stringify(data));
    })
    .catch(err => {
        res.send(err);
    });
});

app.get('*', (req, res) => {
    res.redirect('/');
});

app.listen(config.PORT, () => {
  console.log(`Example app listening at http://localhost:${config.PORT}`);
});

const bodyParser = require('body-parser');
const methodOverride = require('method-override');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(function (err, req, res, next) {
    res.send(`<h1>'${err}'</h1>
                <br/><a href="/logout">Click here to logout</a>
                <br><a href="/">Click here to go back to the Home Page</a>`
            );
});