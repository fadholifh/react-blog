const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

mongoose.connect(process.env.MONGO_URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDBs');
});

app.get('/', (req, res ) => {
    res.send(`hello world`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('server started on http://localhost:'+port);    
});