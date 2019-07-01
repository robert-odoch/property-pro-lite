const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

const server = require('../app.js');

const username = 'rodoch';
const password = 'r0Doch95';

describe('API endpoint /property/<:property-id>', () => {
    let token;
    let request;
    let properties;

    before(done => {
        chai.request(server).post('/v1/auth/signin').send({username, password})
        .end((err, res) => {
            res.should.have.status(200);
            token = res.body.data.token;

            chai.request(server).get('/v1/property')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                properties = res.body.data;

                done();
            });
        });

    });

    beforeEach(() => {
        request = chai.request(server);
    });

    it('updates a property with the given ID', (done) => {
        request.patch(`/v1/property/${properties[0].id}`)
        .set('x-access-token', token)
        .send({type: '3 Bedroom', price: 38000000, state: 'Nigeria', city: 'Lagos', address: 'Main Street'})
        .end((err, res) => {
            res.should.have.status(200);

            done();
        });
    });

    it('ensures only property owner can update property', (done) => {
        // TODO: provide better implementation.

        done();
    });
});