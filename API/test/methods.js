const chai = require('chai');
const expect = chai.expect;

const validateUserJson = (user) => {
    expect(user).to.haveOwnProperty('token');
    expect(user).to.haveOwnProperty('id');
    expect(user).to.haveOwnProperty('first_name');
    expect(user).to.haveOwnProperty('last_name');
    expect(user).to.haveOwnProperty('email');
    expect(user).to.haveOwnProperty('address');
    expect(user).to.haveOwnProperty('is_admin');
};

const validatePropertyJson = (property) => {
    expect(property).to.haveOwnProperty('id');
    expect(property).to.haveOwnProperty('status');
    expect(property).to.haveOwnProperty('type');
    expect(property).to.haveOwnProperty('state');
    expect(property).to.haveOwnProperty('city');
    expect(property).to.haveOwnProperty('price');
    expect(property).to.haveOwnProperty('created_on');
    expect(property).to.haveOwnProperty('image_url');
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
    expect(result).to.haveOwnProperty('data');
};

const validateErrorResult = (result) => {
    expect(result.status).to.equal('error');
    expect(result).to.haveOwnProperty('error');
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