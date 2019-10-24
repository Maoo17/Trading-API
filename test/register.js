process.env.NODE_ENV = 'test'

const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
require('dotenv').config();

chai.use(chaiHttp);
chai.should();

const db = require('../db/database.js');



describe("Rest Of Auth", () => {
    before(() => {
        return new Promise((resolve) => {
            db.run("DELETE FROM user", (err) => {
                if (err) {
                    console.log("Could not empty test DB table user", err.message);
                }
                resolve();
            });
        });
    });

    describe("POST /auth/register", () => {
        it("Should create a new user", (done) => {
            let user = {
                firstName: "Testa",
                lastName: "Testberg",
                birthday: "2019-09-21",
                email: "test@test.se",
                password: "test"
            };

            chai.request(app)
                .post(`/auth/register`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.data.status.should.equal(200)
                    done();
                });
        });
    });

    describe("POST /auth/login", () => {
        it("Should login the user test@test.se", (done) => {
            let user = {
                email: "test@test.se",
                password: "test"
            };

            chai.request(app)
                .post(`/auth/login`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.valid.should.equal(true);
                    done();
                });
        });
    });
});

