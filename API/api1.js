const express = require('express');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { ensureToken, getTokenUsername, getUserJson } = require('./methods');

let users = [];
let properties = [];

const api = express.Router();

api.post('/auth/signup', (req, res) => {
    const user = req.body;
    if (!user.firstName || !user.lastName || !user.email ||
            !user.phoneNumber || !user.address || user.username ||
            !user.password || !user.passwordConfirmation) {
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

// All routes after this point requires user to be logged in.
api.use(ensureToken);

api.post('/property', (req, res) => {
    const property = req.body;
    if (property.name === '' || property.type === '' || property.picture === '' ||
            property.price === '' || property.status === '' || property.state === '' ||
            property.city === '' || property.address === '') {

        res.status(400).json({
            'status': 'error',
            'message': 'Incomplete details submitted!'
        });

        return;
    }

    // Get the user posting the property
    const token = req.headers['x-access-token'];
    const username = getTokenUsername(token);
    if (!username) {
        res.status(500).json({
            'status': 'error',
            'error': 'Something went wrong'
        });

        return;
    }

    const user = users.find((u) => {
        return u.username === username;
    });
    if (!user) {
        res.status(500).json({
            'status': 'error',
            'error': 'Something went wrong!'
        });

        return;
    }

    // Store the new property.
    const newProperty = {
        'id': uuidv4(),
        'owner': user.id,
        'name': property.name,
        'status': property.status,
        'type': property.type,
        'state': property.state,
        'city': property.city,
        'address': property.address,
        'price': property.price,
        'created_on': new Date(),
        'image_url': 'http://www.example.com'
    };
    properties.push(newProperty);

    res.status(201).json({
        'status': 'success',
        'data': newProperty
    });
});

api.get('/property', (req, res) => {
    let results = properties;

    const type = req.query.type;
    if (type) {
        results = properties.filter((p) => p.type === type);
    }

    res.status(200).json({
        'status': 'success',
        'data': results
    });
});

api.get('/property/:id', (req, res) => {
    const property = properties.find(p => p.id === req.params.id);
    if (property) {
        res.status(200).json({
            'status': 'success',
            'data': property
        });

        return;
    }

    res.status(404).json({
        'status': 'error',
        'error': 'Could not find the property you are looking for'
    });
});

api.patch('/property/:id', (req, res) => {
    const property = properties.find(p => p.id === req.params.id);
    if (!property) {
        res.status(404).json({
            'status': 'error',
            'error': 'Could not find the property you are looking for'
        });

        return;
    }

    // Get the user updating the advert
    const token = req.headers['x-access-token'];
    const username = getTokenUsername(token);
    if (!username) {
        res.status(500).json({
            'status': 'error',
            'error': 'Something went wrong'
        });

        return;
    }

    const user = users.find((u) => {
        return u.username === username;
    });
    if (!user) {
        res.status(500).json({
            'status': 'error',
            'error': 'Something went wrong!'
        });

        return;
    }

    // Ensure user updating advert is property owner
    if (user.id !== property.owner) {
        res.status(403).json({
            'status': 'error',
            'error': 'You do not have the proper permissions to update this property'
        });

        return;
    }

    const updates = req.body;
    if (updates.type) {
        property.type = updates.type;
    }
    if (updates.price) {
        property.price = updates.price;
    }
    if (updates.state) {
        property.state = updates.state;
    }
    if (updates.city) {
        property.city = updates.city;
    }
    if (updates.address) {
        property.address = updates.address
    }

    properties.forEach(p => {
        if (p.id !== property.id) {
            return;
        }

        p.type = property.type;
        p.price = property.price;
        p.state = property.state;
        p.city = property.city;
        p.address = property.address;
    });

    res.status(200).json({
        'status': 'success',
        'data': property
    });
});

api.patch('/property/:id/sold', (req, res) => {
    const property = properties.find(p => p.id === req.params.id);
    if (!property) {
        res.status(404).json({
            'status': 'error',
            'error': 'Could not find the property you are looking for'
        });

        return;
    }

    // Get the user updating the advert
    const token = req.headers['x-access-token'];
    const username = getTokenUsername(token);
    if (!username) {
        res.status(500).json({
            'status': 'error',
            'error': 'Something went wrong'
        });

        return;
    }

    const user = users.find((u) => {
        return u.username === username;
    });
    if (!user) {
        res.status(500).json({
            'status': 'error',
            'error': 'Something went wrong!'
        });

        return;
    }

    // Ensure user updating advert is property owner
    if (user.id !== property.owner) {
        res.status(403).json({
            'status': 'error',
            'error': 'You do not have the proper permissions to update this property'
        });

        return;
    }

    // Update property status
    property.status = 'Sold';
    properties.forEach(p => {
        if (p.id !== property.id) {
            return;
        }

        p.status = property.status;
    });

    res.status(200).json({
        'status': 'success',
        'data': property
    });
});

api.delete('/property/:id', (req, res) => {
    const property = properties.find(p => p.id === req.params.id);
    if (!property) {
        res.status(404).json({
            'status': 'error',
            'error': 'Could not find the property you are looking for'
        });

        return;
    }

    // Get the user deleting the advert
    const token = req.headers['x-access-token'];
    const username = getTokenUsername(token);
    if (!username) {
        res.status(500).json({
            'status': 'error',
            'error': 'Something went wrong'
        });

        return;
    }

    const user = users.find((u) => {
        return u.username === username;
    });
    if (!user) {
        res.status(500).json({
            'status': 'error',
            'error': 'Something went wrong!'
        });

        return;
    }

    // Ensure user updating advert is property owner
    if (user.id !== property.owner) {
        res.status(403).json({
            'status': 'error',
            'error': 'You do not have the proper permissions to delete this property'
        });

        return;
    }

    // Delete the property.
    properties = properties.filter(p => p.id !== property.id);
    res.status(200).json({
        'status': 'success',
        'data': {
            'message': 'Property successfully deleted'
        }
    });
});

module.exports = api;