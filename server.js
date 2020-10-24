const express = require('express');
const connection = require('./db/database');

const PORT = process.env.PORT || 3001;
const app = express();

const apiRoutes = require('./routes/apiRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api, apiRoutes');

app.get('/', (req,res) => {
    res.json({
        message: 'Server is running'
    });
});

app.use((req,res) => {
    res.status(404).end();
});

connection.on('connect', () => {
    app.listen(PORT, () => {
        console.log(`API server now on port ${PORT}!`);
    });
});