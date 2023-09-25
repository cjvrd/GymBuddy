const jwt = require('jsonwebtoken');

function verifyAndAuthorize(req, res, next) {
    // retrieve JWT_SECRET from environment variables
    // const JWT_SECRET = process.env.JWT_SECRET;

    // check for the authorization header
    const bearerHeader = req.headers['authorization'];

    // if the header exists, try to verify the JWT
    if (typeof bearerHeader !== 'undefined') {
        // extracting the token from the Bearer prefix
        const bearerToken = bearerHeader.split(' ')[1];

        jwt.verify(bearerToken, secret, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }
            // attach userId from the decoded JWT to the request
            req.userId = decoded.id;

            // move on to the next route handler
            next();
        });

    } else {
        res.status(403).json({ message: 'Token not provided' });
    }
};

module.exports = verifyAndAuthorize;