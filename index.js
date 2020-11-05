const express = require('express');
const app = express();
const port = 8080;
const users = require('fake_data.js');

const _key = '3PN3o9AQbvFIvRxyazCo3tRvYPHyLlFI';

app.use(express.static('public'));

/**
 * Takes post request from client signup and adds them to the user list.
 * NEED TO WIRE signup.html TO SEND POST REQUEST VIA FORM
 */
app.route('/signup')
    .post((req, res) => {
        if(!req.body.id || !req.body.password) {
            res.status(400);
            res.send("Invalid Details!");
        } else {
            users.filter((user) => {
                if(user.id === req.body.id) {
                    res.send('User already exists.');
                }
            });
            const newUser = { id: req.body.id, password: req.body.password };
            users.push(newUser);
            req.session.user = newUser;
            res.redirect('/app');
        }
    });

/**
 * Takes post request from client signin and checks info to see if user. If login credentials are valid
 * it sends them to the app html
 * NEED TO WIRE signin.html TO SEND POST REQUEST VIA FORM
 */
app.route('/signin')
    .post((req, res) => {
        if(!req.body.id || !req.body.password) {
            res.status(401);
            res.send("id or password empty!");
        } else {
            users.filter((user) => {
                if(user.id === req.body.id && user.password === req.body.password) {
                    req.session.user = user;
                    res.redirect('/app');
                }
            });
            res.send('Invalid credentials!');
        }
    });

/**
 * Respond to client making calls for info from NYTimes API 
 * CURRENTLY BROKEN
 */
app.post('/mostPopular', async function(req, res) {
    const response = getMostPopular();
    res.send(response);
    try {
        const path = `https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=${_key}`;
        const response = await fetch(path);

        if(response.ok) {
            const pop_JSON = await response.json();
            res.send(JSON.stringify(pop_JSON)); 
        } else {
            throw new Error(response.statusText);
        }
    } catch(e) {
        res.status = 405;
        res.send({
            'status': e
        });
    }
});

app.get('/topStories', async function(req, res) {
    try {
        const response = await fetch(`https://api.nytimes.com/svc/v2/us.json?api-key=${_key}`);
        if(response.ok) {
            const top_JSON = await response.json();
            res.json(top_JSON);
        } else {
            throw new Error(response.statusText);
        }
    } catch(e) {
        res.json({
            'errorCode': 405,
            'statusText': e,
            'msg': 'Could not retrieve most popular stories.'
        });
    }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});