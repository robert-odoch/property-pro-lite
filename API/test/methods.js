const chai = require('chai');
const expect = chai.expect;

const validateUserJson = (user) => {
    expect(user).to.have.ownProperty('token');
    expect(user).to.have.ownProperty('id');
    expect(user).to.have.ownProperty('first_name');
    expect(user).to.have.ownProperty('last_name');
    expect(user).to.have.ownProperty('email');
    expect(user).to.have.ownProperty('address');
    expect(user).to.have.ownProperty('is_admin');
};

const validatePropertyJson = (property) => {
    expect(property).to.have.ownProperty('id');
    expect(property).to.have.ownProperty('status');
    expect(property).to.have.ownProperty('type');
    expect(property).to.have.ownProperty('state');
    expect(property).to.have.ownProperty('city');
    expect(property).to.have.ownProperty('price');
    expect(property).to.have.ownProperty('created_on');
    expect(property).to.have.ownProperty('image_url');
};

const validatePropertiesJson = (properties) => {
    expect(properties).to.be.an('array');

    properties.forEach(p => validatePropertyJson(p));
}

const validateDeleteResponse = (response) => {
    expect(response).to.haveOwnProperty('message');
}

const validateSuccessResult = (result) => {
    expect(result.status).to.equal('success');
    expect(result).to.have.ownProperty('data');
};

const validateErrorResult = (result) => {
    expect(result.status).to.equal('error');
    expect(result).to.have.ownProperty('error');
};

const methods = {
    validateErrorResult,
    validateSuccessResult,
    validateDeleteResponse,
    validateUserJson,
    validatePropertyJson,
    validatePropertiesJson
};

module.exports = methods;