const express = require('express');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { getUserJson } = require('./methods');

let users = [];

const api = express.Router();

api.post('/auth/signup', (req, res) => {
    const user = req.body;
    if (user.firstName === '' || user.lastName === '' || user.email === '' ||
            user.phoneNumber === '' || user.address === '' || user.username === '' ||
            user.password === '' || user.passwordConfirmation === '') {
        res.status(400).json({
            "status": "error",
            "error": "Some details are missing"
        });

        return;
    }

    // Ensure the email is unique
    const found = users.find(u => u.username === user.username);
    if (found) {
        res.status(400).json({
            'status': 'error',
            'error': 'The username is already taken'
        });

        return;
    }

    // Ensure that the two passwords match
    if (user.password !== user.passwordConfirmation) {
        res.status(400).json({
            "status": "error",
            "error": "The two passwords do not match"
        });

        return;
    }

    // Store the new user.
    const newUser = {
        'token': jwt.sign({username: user.username}, 'secretkey'),
        'id': uuidv4(),
        'first_name': user.firstName,
        'last_name': user.lastName,
        'email': user.email,
        'phoneNumber': user.phoneNumber,
        'address': user.address,
        'username': user.username,
        'password': bcrypt.hashSync(user.password, 10)
    };
    users.push(newUser);

    res.status(201).json({
        "status": "success",
        "data": getUserJson(newUser)
    });
});

api.post('/auth/signin', (req, res) => {
    const data = req.body;
    const user = users.find((u) => {
        return bcrypt.compareSync(data.password, u.password);
    });

    if (!user) {
        res.status(400).json({
            'status': 'error',
            'error': 'Invalid loggin details!'
        });

        return;
    }

    res.status(200).json({
        'status': 'success',
        'data': getUserJson(user)
    });

    return;
});

module.exports = api;