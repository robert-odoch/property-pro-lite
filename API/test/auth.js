const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const {
    validateErrorResult,
    validateSuccessResult,
    validateUserJson } = require('./methods');

const username = 'rodoch';
const password = 'r0Doch95';

chai.use(chaiHttp);
const should = chai.should();

describe('API endpoint /auth/signup', () => {
    const data = {
        firstName: 'Robert',
        lastName: 'Odoch',
        address: 'Kampala, Uganda',
        email: 'robertelvisodoch@gmail.com',
        phoneNumber: '0779322831',
        username,
        password,
        passwordConfirmation: password
    };
    let request;

    beforeEach(() => {
        request = chai.request(server).post('/v1/auth/signup');
    });

    it('creates a new account', (done) => {
        request.send(data).end((err, res) => {
            res.should.have.status(201);

            const result = res.body;
            validateSuccessResult(result);

            const user = result.data;
            validateUserJson(user);

            done();
        });
    });

    it('rejects incomplete registration details', (done) => {
        request.send({...data, firstName: '', username: ''}).end((err, res) => {
            res.should.have.status(400);

            const result = res.body;
            validateErrorResult(result);

            done();
        });
    });

    it('rejects duplicate usernames', (done) => {
        request.send(data).end((err, res) => {
            res.should.have.status(400);

            const result = res.body;
            validateErrorResult(result);

            done();
        });
    })

    it('ensures password confirmation matches password', (done) => {
        request.send({...data, password: '123', passwordConfirmation: '456'})
        .end((err, res) => {
            res.should.have.status(400);

            const result = res.body;
            validateErrorResult(result);

            done();
        });
    });
});

describe('API endpoint /auth/signin', () => {
    let request;

    beforeEach(() => {
        request = chai.request(server).post('/v1/auth/signin');
    });

    it('signs in a user', (done) => {
        request.send({username, password})
        .end((err, res) => {
            res.should.have.status(200);

            const result = res.body;
            validateSuccessResult(result);

            const user = result.data;
            validateUserJson(user);

            done();
        });
    });

    it('rejects invalid sign in details', (done) => {
        request.send({username, password: '12345'})
        .end((err, res) => {
            res.should.have.status(400);

            const result = res.body;
            validateErrorResult(result);

            done();
        });
    });
});