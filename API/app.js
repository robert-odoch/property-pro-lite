const express = require('express');
const apiVersion1 = require('./api1');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use('/v1', apiVersion1);

app.listen(3000, () => {
    console.log('App started on port: 3000');
});

module.exports = app;