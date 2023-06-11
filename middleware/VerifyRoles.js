const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) {
            return res.status(401).send('No roles found!!')
        }
        const authorization = req.headers.authorisation || req.headers.authorization;
        if (!authorization) {
            return res.status(401).send('Authentication header not found');
        }

        const matchRoles = [...allowedRoles];
        const userRoles = JSON.parse(req.roles);
        console.log(matchRoles);
        console.log(userRoles);

        const result = userRoles.map(role => matchRoles.includes(role)).find(val => val === true);
        if (!result) return res.status(401).send(`${matchRoles} did not match every of ${req.email} roles !!!`);
        next();
    }
}

module.exports = verifyRoles;