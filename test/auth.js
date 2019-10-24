process.env.NODE_ENV = 'test'

const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
require('dotenv').config();

chai.use(chaiHttp);
chai.should();

const payload = { email: 'test@gmail.com' };
const secret = "testsecret";
const testToken = jwt.sign(payload, secret, { expiresIn: '1h' });

describe("auth", () => {
    describe("POST /auth", () => {
        it("Should validate token", (done) => {
            chai.request(app)
                .post(`/auth/validatetoken/${testToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});