const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const api = require('./routes/routes');
const db = require('./database/db');


// New express application.
const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// This application level middleware prints incoming requests to the servers console.
app.use((req, res, next) => {
    console.log(`Request_Endpoint: ${req.method} ${req.url}`);
    next();
});

// Configure the bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const curSession = session({
    key: 'framaCookie',
    secret: 'BfAPMyNrUt',
    resave: false,  //FIXME: potentially wrong
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000      // After 1 hour session cookie expires.
    }
})

app.use(curSession);

app.use('/', api);

// Set up a static directory for CSS, JS, images and public files.
app.use(express.static(__dirname + '/public'));

app.get('*', (req, res) => {
    res.status(404).send("Page not found");
});

module.exports = app;