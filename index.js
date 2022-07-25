const https = require('https');
const express = require('express');
const config = require('./config').config;
const Routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())

let routes = new Routes();
routes.routes(app);

app.listen(config.port, function () {
 console.info('Server is running at port 3000');
});
