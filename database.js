const mysql2 = require('mysql2');
const mysql2_promise = require('mysql2/promise');
const bcrypt = require('bcrypt');
const config = require('./config/config');
const connection = mysql2.createConnection(config.db);

async function initialiseRoles() {
    var sql = `SELECT * FROM roles`;
    var results = await query_asynch(sql);
    if (results.length > 0) {
        return;
    }

    console.log("Initialise roles")
    var roles = config.roles;
    if (!roles) {
        throw new Error('Roles cannot be empty');
    }

    for (const val of roles) {
        sql = `INSERT INTO roles (name) VALUES (${mysql2.escape(val.name)})`;
        results = await query_asynch(sql);
    }
}

async function InitialiseRootUser() {
    var sql = `SELECT * FROM users`;
    var results = await query_asynch(sql);
    if (results.length > 0) {
        return;
    }

    console.log("Initialise root user")
    var roles = JSON.stringify(['root', 'user']);
    var encryptedRootPassword = await bcrypt.hash(config.root_user.password, 10);
    sql = `INSERT INTO users (email, password, idHospital, roles) 
    VALUES (
        ${mysql2.escape(config.root_user.email)}, 
        ${mysql2.escape(encryptedRootPassword)}, 
        ${mysql2.escape(config.hospital.reference)}, 
        ${mysql2.escape(roles)})`;

    results = await query_asynch(sql);
    console.log(results);
}


function initialiseDB() {
    connection.connect(async (error) => {
        if (error) {
            console.error(error)
            return;
        }

        console.log("connected");
        await initialiseRoles();
        await InitialiseRootUser();
    });
}

function query(sql, callback) {
    const connection = mysql2.createConnection(config.db);
    connection.query(sql, callback);
}

async function query_asynch(sql, params) {
    const connection = await mysql2_promise.createConnection(config.db);
    const [results,] = await connection.execute(sql, params);
    return results;
}

module.exports = { connection, initialiseDB, query_asynch, query } ;