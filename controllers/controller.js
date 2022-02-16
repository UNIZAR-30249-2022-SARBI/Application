'use strict';

const properties = require('../package.json');
const userApi = require('../services/user');

var controllers = {
    about: (req, res) => {
        var aboutInfo = {
            name: properties.name,
            version: properties.version,
        };
        res.json(aboutInfo);
    },

    register: (req, res) => {
        userApi.register(req, res, (err, dist) => {
            if (err)
                res.send(err);
            res.json(dist);
        });
    },
};

module.exports = controllers;