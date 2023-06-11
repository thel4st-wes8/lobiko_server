const { query } = require('../database');

const testLogin = (req, res) => {
    var sql = `SELECT * FROM tests`;
    query(sql, function (err, result) {
        if (err) throw err;
        res.sendStatus(200);
    });
};

const testLoginAuth = (req, res) => {
    var sql = `SELECT * FROM tests`;
    query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.sendStatus(200);
    });
};

module.exports = {
    testLogin,
    testLoginAuth
}