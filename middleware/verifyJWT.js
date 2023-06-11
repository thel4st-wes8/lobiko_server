const jwt = require('jsonwebtoken');
require("dotenv").config();
const verifyJWT = (req, res, next) => {
    const authorizationHeader = req.headers.authorization || req.headers.Authorization;
    if (!authorizationHeader) {
        return res.status(401).send('Authentication header not found');
    }

    if (!authorizationHeader.startsWith('Bearer')) {
        return res.status(401).send('Invalid auth header format');
    }

    const splits = authorizationHeader.split(' ');
    if (slits.length > 2) {
        return res.status(401).send('Invalid auth header format');
    }

    if (slits.length <=1) {
        return res.status(401).send('No auth header value provided');
    }



    const token = splits[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send(`Authentication failed: ${err}`);
        }

        req.email = decoded.email;
        req.user = decoded.username;
        req.roles = decoded.roles;
        next();
    })
}

module.exports = verifyJWT;
