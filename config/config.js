const { v4: uuidv4 } = require('uuid');
const roles = require('./roles.json')
const config = {
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_DATABASE || "jojo",
        port: process.env.DB_PORT || "3306"
    },
    listPerPage: 10,
    root_user: {
        email: process.env.ROOT_EMAIL || 'root',
        password: process.env.ROOT_PASSWORD || '1234',
    },
    hospital: {
        reference: process.env.HOSPITAL || `Lobiko_${uuidv4()}`
    },
    roles:roles.roles
};

module.exports = config;