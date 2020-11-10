const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const datafile = './fake_data.json';
const users = require(datafile);
const mostPopular = require('./mostPop.json');
const topStories = require('./topStories.json');

const port = process.env.PORT || 8000;

app.use(express.static('public'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('index.html');
});

/**
 * Takes post request from client signup and adds them to the user list.
 */
app.route('/signup')
    .get((req, res) => {
        res.send('signup.html');
    })
    .post((req, res) => {
        if(!req.body.id || !req.body.password) {
            res.status(400).send("Invalid Details!");
            return;
        } else {
            users.filter((user) => {
                if(user.email === req.body.id) {
                    res.status(400).send("Account already exists under this email.");
                    return;
                }
            });
            console.log(req.body.interests);
            const newUser = {
                name: req.body.name,
                email: req.body.id,
                password: req.body.password,
                interests: req.body.interests,
                charities: req.body.charities
            };

            users.push(newUser);
            fs.writeFile(datafile, JSON.stringify(users), err => {
                if (err) {
                    console.err(err);
                }
            });
            res.redirect('/signin');
        }
    });

/**
 * Takes post request from client signin and checks info to see if user. If login credentials are valid
 * it sends them to the app html
 */

app.get('/signin', (req, res) => {
        res.send('../signin/sign_in.html');
});
app.post('/signin', (req, res) => {
    if(!req.body.id || !req.body.password) {
        res.status(400).send("Username and/or Password empty!");
    } else {
        const loggedInUser = users.filter((user) => {
            if(user.email === req.body.id && user.password === req.body.password) {
                req.session.loggedin = true;
                req.session.username = user.email;
                return true;
            } else {
                return false;
            }
        });
        if(!loggedInUser) {
            res.status(400).send('Invalid Username and/or Password!');
        } else {
            res.redirect('/app');
        }
    }
});

app.get('/app', (req, res) => {
    if(req.session.loggedin) {
        res.send('../app/app.html');
    } else {
        res.status(400).send('Please login to view this page!');
    }
});

app.get('/index', (req, res) => {
    res.send('../index.html');
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
    });
    res.redirect('/index');
});

app.get('/userInfo', (req, res) => {
    if(!req.session.loggedin) {
        res.status(404).send('You need to login or create an account!');
    } else {
        const userInfo = users.filter((user) => {
            return user.email === req.session.username;
        });
        res.status(200).send(userInfo);
    }
});

app.post('/changePass', (req, res) => {
    if(!req.session.loggedin) {
        res.status(404).send('You need to login or create an account!');
    } else {
        users.forEach(user => {
            if (user.email === req.session.username) {
                user.password = req.body.password;
            }
        });
        fs.writeFile(datafile, JSON.stringify(users), err => {
            if (err) {
                console.err(err);
            }
        });
        res.sendStatus(200);
    }
});

app.get('/closeAccount', (req, res) => {
    if(!req.session.loggedin) {
        res.status(404).send('You need to login or create an account!');
    } else {
        const userInfoIndex = users.findIndex((user) => user.email === req.session.username);
        users.splice(userInfoIndex, userInfoIndex >= 0 ? 1 : 0);
        fs.writeFile(datafile, JSON.stringify(users), err => {
            if (err) {
                console.err(err);
            }
        });
        res.redirect('/logout');
    }
});

app.get('/topStories', (req, res) => {
    const resData = topStories.results;
    res.json({ topStoriesResults: resData });
});

app.get('/mostPopular', (req, res) => {
    const resData = mostPopular.results;
    res.json({ mostPopularResults: resData });
});

app.get('*', (req, res) => {
    res.status(404);
    res.send('request does not exist.');
});

/**
 * Respond to client making calls for info from NYTimes API 
 * CURRENTLY BROKEN
 */
// app.post('/mostPopular', async function(req, res) {
//     const response = getMostPopular();
//     res.send(response);
//     try {
//         const path = `https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=${_key}`;
//         const response = await fetch(path);

//         if(response.ok) {
//             const pop_JSON = await response.json();
//             res.send(JSON.stringify(pop_JSON)); 
//         } else {
//             throw new Error(response.statusText);
//         }
//     } catch(e) {
//         res.status = 405;
//         res.send({
//             'status': e
//         });
//     }
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});