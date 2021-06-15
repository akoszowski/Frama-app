const db = require('./db');

class Queries {
    static async registerUser(username, email, password) {
        let vals = [username, email, password];
        let res = await db.query('INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING username', vals);
        return res.rowCount > 0;
    }

    static async loginUser(unameEmail, password) {
        let vals = [unameEmail, password];
        let res = await db.query('SELECT username FROM users WHERE (username = $1 OR email = $1) AND password = $2', vals);
        return res.rows[0];
    }

    static async userDirs(username) {
        let res = await db.query('SELECT * FROM directories WHERE owner = $1', [username]);
        return res.rows;
    }

    static async userFiles(username) {
        let res = await db.query('SELECT * FROM files WHERE owner = $1', [username]);
        return res.rows;
    }

    static async newDir(name, description, owner) {
        let vals = [name, description, owner];
        let res = await db.query('INSERT INTO directories(name, description, owner) VALUES($1, $2, $3) RETURNING directory_id', vals);
        return res;
    }

    static async newFile(name, description, owner, parent_dir) {
        let parent_dir_id = await (await db.query('SELECT directory_id FROM directories WHERE name = $1 AND owner = $2', [parent_dir, owner])).rows[0].directory_id;
        console.log(parent_dir, parent_dir_id);
        let vals = [name, description, owner, parent_dir_id];
        let res = await db.query('INSERT INTO files(name, description, owner, parent_dir_id) VALUES($1, $2, $3, $4) RETURNING file_id', vals);
        return res;
    }
}

module.exports = Queries;