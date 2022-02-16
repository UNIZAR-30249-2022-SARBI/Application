const express = require('express');
const app = express();
var cors = require('cors')

app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json())
app.use(cors())

const routes = require('./api_routes/routes');
routes(app);
const port = process.env.PORT || 3002;

app.listen(port, () => {
    console.log(`Listening to port http://localhost:${port}`);
});