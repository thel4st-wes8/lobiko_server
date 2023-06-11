const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require("dotenv").config();
const { query } = require('../database');

const handleLogin = (req, res) => {
    const { email, username, password } = req.body;
    var sql = `SELECT * FROM users WHERE email = ${mysql.escape(email)}`;
    query(sql, async function (err, result) {
        if (err) throw err;
        if (result.length === 0) {
            res.status(400).send("User does not exist!!!");
        }
        else {
            var foundUser = result[0];
            console.log(result);
            //res.send("We found a match !!!");
            if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
                // Create token
                const accessToken = jwt.sign(
                    {
                        "email": foundUser.email,
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "2h" }
                );

                const refreshToken = jwt.sign(
                    {
                        "email": foundUser.email,
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: "1d" }
                );

                sql = `UPDATE users 
                SET refresh_token=${mysql.escape(refreshToken)}  
                WHERE email = ${mysql.escape(email)}`;
                query(sql, async function (err, result) {
                    if (err) throw err;
                    res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                    res.status(200).json(accessToken);
                });
            }
            else {
                res.status(400).send("Invalid Credentials");
            }
        }
    });
};

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401)
    }

    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    var sql = `SELECT * FROM users WHERE refresh_token = ${mysql.escape(refreshToken)}`;
    query(sql, async function (err, result) {
        if (err) throw err;
        if (result.length === 0) {
            res.status(400).send("User does not exist!!!");
        }
        else {
            var foundUser = result[0];
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err || foundUser.email!== decoded.email) {
                    return res.sendStatus(403);
                }

                const accessToken = jwt.sign(
                    { "email": foundUser.email, "username": foundUser.username },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "2h" }
                );

                res.status(200).json({ accessToken });
            });
        }
    });
  
};

const handleLogout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204)
    }

    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    var sql = `SELECT * FROM users WHERE refresh_token = ${mysql.escape(refreshToken)}`;
    query(sql, async function (err, result) {
        if (err) throw err;
        if (result.length === 0) {
            res.clearCookie('jwt', { httpOnly: true });
            return res.sendStatus(204);
        }
        else {
            var foundUser = result[0];
            sql = `UPDATE users 
                SET refresh_token=${mysql.escape(null)}  
                WHERE email = ${mysql.escape(foundUser.email)}`;
            query(sql, async function (err, result) {
                if (err) throw err;
                res.clearCookie('jwt', { httpOnly: true });
                res.sendStatus(204);
            });
        }
    });
}

const isLoggedin = (req, res) => {
    let name = req.body.name;
    let password = req.body.password;
    res.send(true);
};

module.exports = {
    handleLogin,
    handleRefreshToken,
    handleLogout,
    isLoggedin
}