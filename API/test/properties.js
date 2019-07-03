const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const {
    validateErrorResult,
    validateSuccessResult,
    validatePropertyJson,
    validatePropertiesJson } = require('./methods');

const username = 'rodoch';
const password = 'r0Doch95';

chai.use(chaiHttp);
const expect = chai.expect;

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

            const result = res.body;
            validateSuccessResult(result);

            expect(result.data).to.haveOwnProperty('token');
            token = result.data.token;

            done();
        });
    });

    beforeEach(() => {
        request = chai.request(server);
    });

    it('creates a new property', (done) => {
        request.post('/v1/property')
        .set('x-access-token', token)
        .field(data)
        .attach('image', './test/property.jpg')
        .end((err, res) => {
            res.should.have.status(201);

            const result = res.body;
            validateSuccessResult(result);

            const property = result.data;
            validatePropertyJson(property);

            done();
        });
    }).timeout(10000);

    it('rejects incomplete property details', (done) => {
        request.post('/v1/property')
        .set('x-access-token', token)
        .send({...data, name: '', price: ''})
        .end((err, res) => {
            res.should.have.status(400);

            const result = res.body;
            validateErrorResult(result);

            done();
        });
    });

    it('gets all properties', (done) => {
        request.get('/v1/property')
        .set('x-access-token', token)
        .end((err, res) => {
            res.should.have.status(200);

            const result = res.body;
            validateSuccessResult(result);

            const properties = result.data;
            validatePropertiesJson(properties);

            done();
        });
    });

    it('gets all properties of a specific type', (done) => {
        request.get(`/v1/property?type=propertyType`)
        .set('x-access-token', token)
        .end((err, res) => {
            res.should.have.status(200);

            const result = res.body;
            validateSuccessResult(result);

            const properties = result.data;
            validatePropertiesJson(properties);

            done();
        });
    });
});