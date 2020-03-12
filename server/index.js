const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
// dotenv.config();

const config = require('./config/key');

const { User } = require('./models/user');
const { auth } = require('./middleware/auth');

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
    res.json({"hello": "i am happy to deploy application"});
});

//auth
app.get('/api/user/auth', auth, (req, res) => {
    res.status(200).json({
        _id:req._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname:req.user.lastname,
        role: req.user.role
    })
});

// register
app.post('/api/users/register', (req, res) => {
    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({
            success: err
        })
        return res.status(200).json({
            success:true,
            userData: doc
        })
    })
});

//login
app.post("/api/users/login", (req, res) => {
    //find email
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });
        }
        //comparePassword
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: "Wrong password"
                });
            }
        });

        //generateToken
        user.generateToken((err, user) => {
            if(err) return res.status(400).send(err);
            res.cookie("x_auth", user.token)
                .status(200)
                .json({
                    loginSuccess: true
                });
        });
    });
});

app.get("/api/users/logout", auth, (req, res) => {

    User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err, doc) => {
        if(err) return res.json({ success:false, err })
        return res.status(200).send({
            success:true
        });
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('server started on http://localhost:' + port);
});