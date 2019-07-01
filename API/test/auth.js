const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

const server = require('../app.js');

const username = 'rodoch';
const password = 'r0Doch95';

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

            done();
        });
    });

    it('rejects incomplete registration details', (done) => {
        request.send({...data, firstName: '', username: ''}).end((err, res) => {
            res.should.have.status(400);

            done();
        });
    });

    it('rejects duplicate usernames', (done) => {
        request.send(data).end((err, res) => {
            res.should.have.status(400);

            done();
        });
    })

    it('ensures password confirmation matches password', (done) => {
        request.send({...data, password: '123', passwordConfirmation: '456'})
        .end((err, res) => {
            res.should.have.status(400);

            done();
        });
    });
});