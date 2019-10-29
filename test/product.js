process.env.NODE_ENV = 'test'

const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

const db = require('../db/database.js');

chai.use(chaiHttp);
chai.should();

describe("Products", () => {
    describe("Products", () => {

        before(() => {
            return new Promise((resolve) => {
                db.run("DELETE FROM user", (err) => {
                    if (err) {
                        console.log("Could not empty test DB table user", err.message);
                    }
                });

                let sql = `INSERT INTO user
            (firstName, lastName, birthday, email, password, balance)
            VALUES
            ('Testa', 'testefternamn', '2019-09-21', 'tests@gmail.com', 'testpass', '0')`;

                db.run(sql, (err) => {
                    if (err) {
                        console.log(
                            "Could not add product to test DB table user",
                            err.message
                        );
                    }
                    resolve();

                });

                let sql2 = `INSERT INTO deposit (depositId, ownerId, productId)
            VALUES
            (null, "tests@gmail.com", 1)`;

                db.run(sql2, (err) => {
                    if (err) {
                        console.log(
                            "Could not add product relation to user in deposit table",
                            err.message
                        );
                    }
                    resolve();
                });

                let sql3 = `UPDATE user SET balance = 30 WHERE email = "tests@gmail.com"`;

                db.run(sql3, (err) => {
                    if (err) {
                        console.log(
                            "Could not add funds to user tests@gmail.com",
                            err.message
                        );
                    }
                    resolve();
                });
            });
        });

        it("should get all products", (done) => {
            chai.request(app)
                .get('/products')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.not.be.equal(0);
                    done();
                });
        });


        it("should get ALL products owned by tests@gmail.com", (done) => {
            chai.request(app)
                .get('/products/tests@gmail.com')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.be.equal(1);
                    done();
                });
        });

        it("should get products information for all owned products for tests@gmail.com", (done) => {
            chai.request(app)
                .get('/products/tests@gmail.com')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.be.equal(1);
                    done();
                });
        });

        it("should sell owned product", (done) => {
            let data = {
                email: "tests@gmail.com",
                depositId: 1,
                balance: 30,
                price: 30,
                title: "pidgey",
                productId: 3
            };

            chai.request(app)
                .put('/products/sell')
                .send(data)
                .end((err, res) => {
                    console.log(res.body)
                    res.should.have.status(200);
                    res.body.data.message.should.be.equal('Product Sold');
                    res.body.data.balance.should.be.equal(60)
                    done();
                });
        });

        it("should buy product", (done) => {
            let data = {
                email: "tests@gmail.com",
                productId: 3,
                balance: 30,
                price: 30,
                title: "pidgey",
            };

            chai.request(app)
                .post('/products/buy')
                .send(data)
                .end((err, res) => {
                    res.body.data.should.have.status(202);
                    res.body.data.message.should.be.equal('Product Bought');
                    res.body.data.balance.should.be.equal(0)
                    done();
                });
        });
    });

});