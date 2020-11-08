const fs = require('fs');
const {response} = require('express');
const express = require('express');
const app = express();

const datafile = './fake_data.json';
const users = require(datafile);
const mostPopular = require('./mostPop.json');
const topStories = require('./topStories.json');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

const _key = '3PN3o9AQbvFIvRxyazCo3tRvYPHyLlFI';

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.redirect('public');
});

/**
 * Takes post request from client signup and adds them to the user list.
 */
app.route('/signup')
    .get((req, res) => {
        res.redirect(req.originalUrl + 'signup.html');
    })
    .post((req, res) => {
        if(!req.body.id || !req.body.password) {
            res.status(400);
            res.send("Invalid Details!");
        } else {
            users.filter((user) => {
                if(user.email === req.body.id) {
                    res.send('User already exists.');
                }
            });
            const newUser = { first_name: req.body.first_name, last_name: req.body.last_name, id: req.body.id, password: req.body.password };
            users.push(newUser);
            fs.writeFile(datafile, JSON.stringify(users), err => {
                if (err) {
                    console.err(err);
                }
            });
            res.status(200);
            res.send('User Added');
        }
    });

/**
 * Takes post request from client signin and checks info to see if user. If login credentials are valid
 * it sends them to the app html
 */
app.route('/signin')
    .get((req, res) => {
        res.redirect(req.originalUrl + 'sign_in.html')
    })
    .post((req, res) => {
        if(!req.body.id || !req.body.password) {
            res.status(401);
            res.send("id or password empty!");
        } else {
            users.filter((user) => {
                if(user.email === req.body.id && user.password === req.body.password) {
                    res.status(200);
                    res.send('Valid credentials');
                    res.end();
                }
            });
            res.send('Invalid credentials!');
        }
    });

app.post('/interests', (req, res) => {
    console.log(req.body);
    const randoUser = Math.floor(Math.random() * 100);
    const reqInterests = req.body.interests;
    reqInterests.forEach((interest) => {
        users[randoUser].interests.push(interest);
    });
    fs.writeFile(datafile, JSON.stringify(users), err => {
        if (err) {
            console.err(err);
        }
    });
    res.json({ user: users[randoUser] });
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