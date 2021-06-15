const Queries = require('../database/queries');
const multer = require('multer');

const home = (req, res) => {
    if(req.session.username) {
        res.redirect('/app');
    } else {
        res.render('pages/login.ejs', {error: req.session.loginError});
    }
};

const registerPage = (req, res) => {
    if(req.session.username) {
        res.redirect('/app');
    } else {
        res.render('pages/register.ejs');
    }
};

const register = (req, res) => {
    console.log("Register POST request");
    console.log(req.body);

    Queries.registerUser(req.body.username, req.body.email, req.body.password).then(registered => {
        console.log("Registration succeeded!");

        req.session.username = req.body.username;

        res.status(200).send({
            registered: true
        });
    }).catch(err => {
        console.log("Registration failed");
        console.log(err);
        
        req.session.loginError = true;

        res.status(400).send({
            msg: "Registration failed. Account with given username or email already exists!"
        });
    })
};


const login = (req, res) => {
    console.log("Login POST request");
    console.log(req.body);

    Queries.loginUser(req.body.unameEmail, req.body.password).then(row => {
        if(row) {
            req.session.username = row.username;
            console.log("Object?: ", row.username);
            console.log("After login", req.session.username);
            res.redirect('/app');
        } else {
            req.session.loginError = true;
            res.redirect('/');
        }
    });
};


const logout = (req, res) => {
    console.log("Logout request");

    if (req.session.username) {
        req.session.destroy(err => {
            if (err) {
                console.log("Error destroying session!");
            }
        })
    }
    res.redirect('/');
}


const app = (req, res) => {
    if (!req.session.username) {
        res.redirect('/');
    } else {
        console.log(req.session.username);
        res.render('pages/main.ejs', {
            username: req.session.username
        });
    }
}

module.exports.home = home;
module.exports.registerPage = registerPage;
module.exports.register = register;
module.exports.login = login;
module.exports.logout = logout;
module.exports.app = app;