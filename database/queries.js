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

}

module.exports = Queries;