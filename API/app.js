const express = require('express');
const apiVersion1 = require('./api1');
const { urlencoded, json } = require('body-parser');
const { cloudinaryConfig } = require('./config/cloudinary');

const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());
app.use('*', cloudinaryConfig);
app.use('/v1', apiVersion1);

app.listen(3000, () => {
    console.log('App started on port: 3000');
});

module.exports = app;