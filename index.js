require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {ERR, OK} = require('./utils/response');
const routes = require('./routes/index.route');
const { API_PORT, MONGO_URL } = process.env;

const app = express();
const port = API_PORT;


app.use(express.json());
app.use(cors());

mongoose.connect(MONGO_URL).catch(err => {
    if(err) {
        console.log('Failed to connect to MongoDB');
        throw err;
    }
    console.log('Connected to MongoDB');
});

app.use(routes);

app.get('/', (req, res) => {
    const data = {
        isRunning: true,
        serverVersion: '1.0.0'
    }
    OK(res, 200, data, 'Welcome to the Netflix API');
});

app.listen(port, () => {
    console.log('Netflix API is running at port ' + port);
});