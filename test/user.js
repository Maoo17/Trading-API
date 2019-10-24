process.env.NODE_ENV = 'test'

const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

const db = require('../db/database.js');

chai.use(chaiHttp);
chai.should();

describe("user", () => {
    describe("GET /users", () => {
        before(() => {
            return new Promise((resolve) => {
                db.run("DELETE FROM user", (err) => {
                    if (err) {
                        console.log("Could not empty test DB table users", err.message);
                    }
                });

                let sql = `INSERT INTO user
                (firstName, lastName, birthday, email, password, balance)
                VALUES
                ('Testa', 'testefternamn', '2019-09-21', 'tests@gmail.com', 'testpass', '0')`;

                db.run(sql, (err) => {
                    if (err) {
                        console.log(
                            "Could not add product to test DB table users",
                            err.message
                        );
                    }
                    resolve();

                });
            });
        });

        it("should get all users", (done) => {
            chai.request(app)
                .get('/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.not.be.equal(0);
                    done();
                });
        });

        it("should get user with email: tests@gmail.com", (done) => {
            chai.request(app)
                .get('/users/tests@gmail.com')
                .end((err, res) => {
                    res.body.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('object');
                    done();
                });
        });

        it("should update users balance", (done) => {
            let data = { email: "tests@gmail.com", balance: 50, current: 0 };

            chai.request(app)
                .put('/users/balance')
                .type('form')
                .send(data)
                .end((err, res) => {
                    res.body.data.should.have.status(202);
                    res.body.data.message.should.be.equal('Updated balance');
                    res.body.data.should.be.an('object');
                    done();
                });
        });

        it("should NOT update users balance", (done) => {
            let data = { email: "", balance: null, current: null };

            chai.request(app)
                .put('/users/balance')
                .type('form')
                .send(data)
                .end((err, res) => {
                    res.body.data.should.have.status(400);
                    res.body.data.message.should.be.equal('Funds were not added');
                    res.body.data.should.be.an('object');
                    done();
                });
        });
    });
});