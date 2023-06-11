const mysql2 = require('mysql2');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const { query } = require('../database');

const handleGetUsers = (req, res) => {
    var sql = `SELECT * FROM users`;
    query(sql, async function (err, result) {
        if (err) throw err;
        return res.status(200).json(result);
    });
};

const handleCreateUser = (req, res) => {
    const { email, username, password, roles } = req.body;
    if (!email) {
        return res.status(400).send('email cannot be empty');
    }

    if (!password) {
        return res.status(400).send('password cannot be empty');
    }

    if (roles.length ===0) {
        return res.status(400).send('roles cannot be empty');
    }

    var sql = `SELECT * FROM users WHERE email = ${mysql2.escape(email)}`;
    query(sql, async function (err, result) {
        if (err) throw err;
        if (result.length > 0) {

            return res.status(400).send('There is a user with same email');
        }

        var encryptedRootPassword = await bcrypt.hash(password, 10);
        sql = `INSERT INTO users (email, password, idHospital, roles) 
        VALUES (
        ${mysql2.escape(email)}, 
        ${mysql2.escape(encryptedRootPassword)}, 
        ${mysql2.escape(config.hospital.reference)}, 
        ${mysql2.escape(JSON.stringify(roles))})`;

        query(sql, async function (err, result) {
            if (err) throw err;
            if (result.length === 0) {
                return res.status(400).send('User not inserted');
            };

            res.status(200).send(true);
        });
    })
};

const handleGetCurrentUser = (req, res) => {
    var email = req.email;
    if (!email) {
        return res.status(400).send('decoded email cannot be empty');
    }

    var sql = `SELECT * FROM users WHERE email = ${mysql2.escape(email)}`;
    query(sql, (err, result)=> {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(400).send('Specificied user does not exist');
        }

        var foundUser = result[0];
        return res.status(200).json(foundUser);
    })
};

const handleDeleteUser = (req, res) => {
    var email = req.email;
    var { deleteEmail } = req.body;
    if (!email) {
        return res.status(400).send('decoded email cannot be empty');
    }

    if (email === deleteEmail) {
        return res.status(400).send('You cannot delete active user');
    }

    var sql = `DELETE  FROM users WHERE email = ${mysql2.escape(deleteEmail)}`;
    query(sql, (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(400).send('Specificied user does not exist');
        }

        var foundUser = result[0];
        return res.status(200).json(foundUser);
    })
};

module.exports = {
    handleGetUsers,
    handleCreateUser,
    handleGetCurrentUser,
    handleDeleteUser
};