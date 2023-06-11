const { query } = require('../database');

const handleGetRoles = (req, res) => {
    var sql = `SELECT * FROM roles`;
    query(sql, async function (err, result) {
        if (err) throw err;
        return res.status(200).json(result);
    });
};

module.exports = {
    handleGetRoles
};