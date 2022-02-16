const axios = require('axios');

const url = 'http://localhost:3003/'
var user = {
    register: (req, res, next) => {
        console.log(url)
        axios.post(url+'register', { name: req.body.name })
            .then(response => {
                console.log('Data:' + JSON.stringify(response.data));
                res.send(response.data);
            })
            .catch(err => {
                console.log('Error: ', err.message);
            });
    }
};

module.exports = user;  