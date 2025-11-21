require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const cors = require('cors');
const routes = require('./routes/index.route');
const { API_PORT, MONGO_URL } = process.env;
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
const port = API_PORT;


app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

mongoose.connect(MONGO_URL).catch(err => {
    if(err) {
        console.log('Failed to connect to MongoDB');
        throw err;
    }
});

app.use(routes);


app.listen(port, () => {
    console.log('Netflix API is running at port ' + port);
});

module.exports = app;