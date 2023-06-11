const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

require("dotenv").config();

var { initialiseDB } = require('./database');
initialiseDB();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve statuic files
app.use(express.static(path.join(__dirname, '/public')));


//routes
app.use('/', require('./routes/root'));
app.use('/authentication', require('./routes/api/authentication'));
app.use('/users', require('./routes/api/users'));
app.use('/roles', require('./routes/api/roles'));
app.use('/test', require('./routes/api/test'));

const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
