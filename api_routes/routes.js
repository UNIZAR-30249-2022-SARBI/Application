'use strict';

const controller = require('../controllers/controller');

module.exports = (app) => {
    app.route('/About').get(controller.about);
    app.post('/Register', controller.register);
};