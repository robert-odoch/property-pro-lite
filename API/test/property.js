const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

const {
    validateErrorResult,
    validateSuccessResult,
    validatePropertyJson,
    validatePropertiesJson,
    validateDeleteResponse } = require('./methods');

const username = 'rodoch';
const password = 'r0Doch95';

chai.use(chaiHttp);
const expect = chai.expect;

describe('API endpoint /property/<:property-id>', () => {
    let token;
    let request;
    let properties;

    before(done => {
        chai.request(server).post('/v1/auth/signin').send({username, password})
        .end((err, res) => {
            res.should.have.status(200);

            const result = res.body;
            validateSuccessResult(result);

            expect(result.data).to.haveOwnProperty('token');
            token = result.data.token;

            chai.request(server).get('/v1/property')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);

                const result = res.body;
                validateSuccessResult(result);

                properties = res.body.data;
                validatePropertiesJson(properties);

                done();
            });
        });
    });

    beforeEach(() => {
        request = chai.request(server);
    });

    it('retrieves the property with the given ID', (done) => {
        request.get(`/v1/property/${properties[0].id}`)
        .set('x-access-token', token)
        .end((err, res) => {
            res.should.have.status(200);

            const result = res.body;
            validateSuccessResult(result);

            const property = result.data;
            validatePropertyJson(property);

            done();
        });
    });

    it('updates a property with the given ID', (done) => {
        const propertyToUpdate = properties[0].id;

        request.patch(`/v1/property/${propertyToUpdate}`)
        .set('x-access-token', token)
        .send({ type: '3 Bedroom', price: 38000000, state: 'Nigeria', city: 'Lagos', address: 'Main Street' })
        .end((err, res) => {
            res.should.have.status(200);

            const result = res.body;
            validateSuccessResult(result);

            const property = result.data;
            validatePropertyJson(property);

            // Ensure that the property has really been updated.
            chai.request(server)
            .get(`/v1/property/${propertyToUpdate}`)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);

                const result = res.body;
                validateSuccessResult(result);

                const property = result.data;
                expect(property).to.have.own.property('type', '3 Bedroom');
                expect(property).to.have.own.property('price', 38000000);
                expect(property).to.have.own.property('state', 'Nigeria');
                expect(property).to.have.own.property('city', 'Lagos');
                expect(property).to.have.own.property('address', 'Main Street');
            });

            done();
        });
    });

    it('ensures only property owner can update property', (done) => {
        // TODO: provide better implementation.

        done();
    });

    it('marks a property as sold', (done) => {
        request.patch(`/v1/property/${properties[0].id}/sold`)
        .set('x-access-token', token)
        .end((err, res) => {
            res.should.have.status(200);

            const result = res.body;
            validateSuccessResult(result);

            const property = result.data;
            validatePropertyJson(property);

            done();
        });
    });

    it('deletes a property with the given ID', (done) => {
        const propertyToDelete = properties[0].id;

        request.delete(`/v1/property/${propertyToDelete}`)
        .set('x-access-token', token)
        .end((err, res) => {
            res.should.have.status(200);

            const result = res.body;
            validateSuccessResult(result);

            const data = result.data;
            validateDeleteResponse(data);

            // Ensure that the property has really been deleted.
            chai.request(server)
            .get(`/v1/property/${propertyToDelete}`)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(404);

                const result = res.body;
                validateErrorResult(result);
            });

            done();
        });
    });

    it('ensures only property owner can delete property', (done) => {
        // TODO: provide better implementation.

        done();
    });
});