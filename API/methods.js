let jwt = require('jsonwebtoken');

const ensureToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, 'secretkey', (err, result) => {
            if (err) {
                res.status(403).json({
                    'status': 'error',
                    'error': 'Unauthorized request'
                });
            }
            else {
                next();
            }
        });
    }
    else {
        res.status(403).json({
            'status': 'error',
            'error': 'Unauthorized request'
        });
    }
};

const getTokenUsername = (token) => {
    try {
        decoded = jwt.verify(token, 'secretkey');

        return decoded.username;
    }
    catch (e) {
        return false;
    }
}

const getUserJson = (user) => {
    return {
        "token": user.token,
        "id": user.id,
        "first_name": user.firstName,
        "last_name": user.lastName,
        "address": user.address,
        "email": user.email,
        "phoneNumber": user.phoneNumber,
        "is_admin": false
    }
};

const methods = { ensureToken, getTokenUsername, getUserJson };

module.exports = methods;