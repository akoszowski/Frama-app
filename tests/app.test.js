const request = require('supertest');
const { response } = require('../app');
const app = require('../app');
const db = require('../database/db');

describe("POST /register", () => {

    test("should save the username, email and the password to the database", async () => {
        const response = await request(app).post("/register").send({
            username: "johndoe",
            email: "john@doe",
            password: "john1234"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.registered).toBe(true);
    });

    test("same user registering second time", async () => {
        const response = await request(app).post("/register").send({
            username: "johndoe",
            email: "john@doe",
            password: "john1234"
        });
        expect(response.statusCode).toBe(400);
    });

    test("violating username unique constraints for registered users", async() => {
        const response = await request(app).post("/register").send({
            username: "johndoe1",
            email: "john@doe",
            password: "john1234"
        });
        expect(response.statusCode).toBe(400);
    });

    test("violating email unique constraints for registered users", async () => {
        const response = await request(app).post("/register").send({
            username: "johndoe",
            email: "john1@doe",
            password: "john1234"
        });
        expect(response.statusCode).toBe(400);
    });

})

describe("POST /login",  () => {
    beforeAll( () => {
        request(app).post("/register").send({
            username: "john1doe",
            email: "john1@doe",
            password: "john1234"
        }).then(() => {
            return;
        })
    })

    test("should have got logged in via username", async () => {
        const response = await request(app).post("/login").send({
            unameEmail: "john1doe",
            password: "john1234"     
        });
        expect(response.headers.location).toBe('/app');
    });

    test("should have got logged in via email", async () => {
        const response = await request(app).post("/login").send({
            unameEmail: "john1@doe",
            password: "john1234"
        });
        expect(response.headers.location).toBe('/app');
    });

    test("invalid username/ email", async () => {
        const response = await request(app).post("/login").send({
            unameEmail: "john0@doe",
            password: "john1234"
        });
        expect(response.headers.location).toBe('/');
    });

    test("invalid password", async () => {
        const response = await request(app).post("/login").send({
            unameEmail: "john1@doe",
            password: "john12345"
        });
        expect(response.headers.location).toBe('/');
    });
})

afterAll(() => {
    db.end();
    return;
});