const Queries = require('../database/queries');

const multer = require('multer');

const { exec, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { stdout } = require('process');

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
};


const app = (req, res) => {
    if (!req.session.username) {
        res.redirect('/');
    } else {
        console.log(req.session.username);
        res.render('pages/main.ejs', {
            username: req.session.username
        });
    }
};

const userDirs = (req, res) => {
    Queries.userDirs(req.session.username).then(rows => {
        res.status(200).send(rows);
    });
}

const userFiles = (req, res) => {
    Queries.userFiles(req.session.username).then(rows => {
        res.status(200).send(rows);
    });
}

const newDirPage = (req, res) => {
    res.render('pages/new_dir.ejs', {error: false});
};

const newDir = (req, res) => {
    console.log(req.body);
    console.log(req.session.username);
    Queries.newDir(req.body.name, req.body.description, req.session.username).then(id => {
        console.log("Folder succesfully added!");
        res.redirect('/');
    }).catch(err => {
        res.render('pages/new_dir', {error: true});
    });
};

const newFilePage = (req, res) => {
    Queries.userDirs(req.session.username).then(dirs => {
        // console.log(dirs);

        res.render('pages/new_file.ejs', {error: req.session.newFileError, dirs: dirs});
    });
};


// Tu jeszcze multer ?!?
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        console.log("Destination:")
        const dest = `./uploads/${req.session.username}/${req.body.parent_dir}`;
        console.log(dest);
        fs.mkdirSync(dest, { recursive: true });
        callback(null, 'uploads/' + req.session.username + '/' + req.body.parent_dir);
    },
    filename: function(req, file, callback) {
        callback(null, req.body.name);
    }
})

const myFilter = function(req, file, callback) {
    if (!file.originalname.match(/\.(c)$/)) {
        req.fileValidationError = "Only .c files are allowed!"
        return callback(new Error("Only .c files are allowed"), false);
    }
    callback(null, true);
};

const newFile = (req, res) => {
    console.log("POST newFile upload");

    upload = multer({storage: storage, fileFilter: myFilter}).single('file');
    upload(req, res, function(err) {
        if (err) {
            console.log(err);
            res.redirect('/new_file');
        } else {
            Queries.newFile(req.body.name, req.body.description, req.session.username, req.body.parent_dir).then(id => {
                console.log("File succesfully added!");
                req.session.newFileError = false;
                res.redirect('/');
            }).catch(err => {
                console.log(err);
                req.session.newFileError = true;
                res.redirect('/new_file');
            });
        }
    })
};

const showFile = (req, res) => {
    let filePath = `./uploads/${req.session.username}/${req.params.folderName}/${req.params.fileName}`;
    
    req.session.curFile = req.params.fileName;

    fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) {
            res.send(err);
            return;
        }
        res.send(data);
    })
};

const showResult = (req, res) => {
    let filePath = `./uploads/${req.session.username}/${req.params.folderName}/${req.params.fileName}`;
    
    execSync('frama-c -wp -wp-prover Z3 -wp-log=r:result.txt ' + filePath);

    fs.readFile('./result.txt', 'utf8', function (err, data) {
        if (err) {
            res.send(err);
            return;
        }
        res.send(data);
    })
};

const showFocus = (req, res) => {
    let filePath = `./uploads/${req.session.username}/${req.params.folderName}/${req.params.fileName}`;
    
    try {
        data = execSync('frama-c -wp -wp-print ' + filePath);
    } catch (ex) {
        data = ex.stdout;
    }
    res.send(data);
};

const delFile = (req, res) => {
    console.log(req.body);

    Queries.delFile(req.body.fileName, req.session.username, req.body.parentDirName).then(() => {
        console.log("File deleted successfully!");
        res.status(200).send({msg: "File deleted"});
    }).catch(err => {
        console.log(err);
        res.status(400).send({msg: "File delete error"});
    });
};

const delFolder = (req, res) => {
    console.log(req.body);

    Queries.delFolder(req.body.fileName, req.session.username).then(() => {
        console.log("Folder deleted successfully!");
        res.status(200).send({msg: "Folder deleted"});
    }).catch(err => {
        console.log(err);
        res.status(400).send({msg: "Folder delete error"});
    });
};

const rerun = (req, res) => {
    console.log(req.body);

    if(req.body.guard) {
        req.session.rerunCmd = `frama-c -wp -wp-prover ${req.body.prover} -wp-prop="-${req.body.conditions}" ${req.body.guard} ${req.session.curFile}`
    } else {
        req.session.rerunCmd = `frama-c -wp -wp-prover ${req.body.prover} -wp-prop="-${req.body.conditions}" ${req.session.curFile}`
    }

    res.status(200).send({rerun_cmd: req.session.rerunCmd});
}

module.exports.home = home;
module.exports.registerPage = registerPage;
module.exports.register = register;
module.exports.login = login;
module.exports.logout = logout;
module.exports.app = app;

module.exports.userDirs = userDirs;
module.exports.userFiles = userFiles;

module.exports.newDirPage = newDirPage;
module.exports.newDir = newDir;
module.exports.newFilePage = newFilePage;
module.exports.newFile = newFile;

module.exports.showFile = showFile;
module.exports.showResult = showResult;
module.exports.showFocus = showFocus;

module.exports.delFile = delFile;
module.exports.delFolder = delFolder;
module.exports.rerun = rerun;