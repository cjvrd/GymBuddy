
function verifyAndAuthorize(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, secret, (err, decoded) => {
            if(err) {
                return res.status(403).json({ message: 'Invalid token'});
            }

            req.userId = decoded.id;
            next();
        });

    } else {
        res.status(403).json({ message: 'Token not provided' });
    }
}

module.exports = verifyAndAuthorize;