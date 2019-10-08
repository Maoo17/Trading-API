process.env.NODE_ENV = 'test'

const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

describe("app", () => {
    describe("GET /", () => {
        // Test to get all users
        it("Should get docs and show html", (done) => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});