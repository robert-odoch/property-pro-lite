const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

const server = require('../app.js');

const username = 'rodoch';
const password = 'r0Doch95';

describe('API endpoint /property', () => {
    const data = {
        name: 'Villa',
        type: '2 Bedroom',
        picture: 'property.jpg',
        price: 20000000,
        status: 'Available',
        state: 'Uganda',
        city: 'Kampala',
        address: 'Wandegeya'
    };
    let request;
    let token;

    before((done) => {
        chai.request(server).post('/v1/auth/signin').send({username, password})
        .end((err, res) => {
            res.should.have.status(200);
            token = res.body.data.token;

            done();
        });
    });

    beforeEach(() => {
        request = chai.request(server);
    });

    it('creates a new property', (done) => {
        request.post('/v1/property')
        .set('x-access-token', token)
        .send(data)
        .end((err, res) => {
            res.should.have.status(201);

            done();
        });
    });

    it('rejects incomplete property details', (done) => {
        request.post('/v1/property')
        .set('x-access-token', token)
        .send({...data, name: '', price: ''})
        .end((err, res) => {
            res.should.have.status(400);

            done();
        });
    });
});