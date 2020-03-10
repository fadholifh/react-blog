const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
// dotenv.config();

const config = require('./config/key');

const {
    User
} = require('./models/user');

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDBs');
});

//use
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send(`hello world`);
});


app.post('/api/users/register', (req, res) => {
    const user = new User(req.body);

    user.save((err, userData) => {
        if (err) return res.json({
            success: err
        })
    })
    return res.status(200).json({
        success:true
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('server started on http://localhost:' + port);
});