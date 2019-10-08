process.env.NODE_ENV = 'test'

const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

chai.use(chaiHttp);
chai.should();

let payload = { email: 'test@gmail.com' };
let secret = "testsecret";
let testToken = jwt.sign(payload, secret, { expiresIn: '1h' });
const db = require('../db/database.js');

describe("reports", () => {
    before(() => {
        return new Promise((resolve) => {
            db.run("DELETE FROM reports", (err) => {
                if (err) {
                    console.log("Could not empty test DB table deliveries", err.message);
                }

                let sql = `INSERT INTO reports
                            (week, reportText)
                            VALUES
                            ('2', 'TESTREPORT');`;

                db.run(sql, (err) => {
                    if (err) {
                        console.log(
                            "Could not add product to test DB table reports",
                            err.message
                        );
                    }
                    resolve();
                });
            });
        });
    });


    describe("GET /reports", () => {
        it("Should get all reports", (done) => {
            chai.request(app)
                .get(`/reports`)
                .set('x-access-token', testToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

        it("Should get report from specified week", (done) => {
            chai.request(app)
                .get(`/reports/week/${2}`)
                .set('x-access-token', testToken)
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.data.should.be.an("Object");
                    done();
                });
        });
    });

    // describe("POST /reports", () => {
    //     it("Should post report to database", (done) => {
    //         let report = {
    //             week: 2,
    //             reportText: "testtext"
    //         };
    //         chai.request(app)
    //             .post(`/reports`)
    //             .set('x-access-token', testToken)
    //             .set('Content-Type', 'application/json')
    //             .set('Accept', 'application/json')
    //             .send(report)
    //             .end((err, res) => {
    //                 console.log(res.body)

    //                 res.should.have.status(200);
    //                 res.body.should.be.a('object');
    //                 // res.body.status.should.equal(200)

    //                 done();
    //             });

    //     });
    // });
});

