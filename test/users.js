process.env.NODE_ENV = 'test'

const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

const db = require('../db/database.js');

chai.use(chaiHttp);
chai.should();

describe("users", () => {
    describe("GET /users", () => {
        before(() => {
            return new Promise((resolve) => {
                db.run("DELETE FROM users", (err) => {
                    if (err) {
                        console.log("Could not empty test DB table users", err.message);
                    }
                });

                let sql = `INSERT INTO users
                (firstName, lastName, birthday, email, password)
                VALUES
                ('Testa', 'testefternamn', '2019-09-21', 'tests@gmail.com', 'testpass')`;

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
    });
});