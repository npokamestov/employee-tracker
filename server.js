const express = require('express');
const connection = require('./db/database');
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', apiRoutes)

app.get('/', (req, res) => {
    res.json({
        message: 'Server is running'
    });
});

app.use((req,res) => {
    res.status(404).end();
});

connection.on('connect', () => {
    app.listen(PORT, () => {
        console.log(`Server now running on port ${PORT}!`);
    });
});