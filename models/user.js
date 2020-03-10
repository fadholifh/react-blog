const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

userSchema.pre("save", function(next) {
    let user = this;

    if (user.isModified("password")) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

//compare
userSchema.methods.comparePassword = (plainPassword, cb) => {
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = cb => {
    let user = this;
    let token = jwt.sign(user._id.toHexString(), "fukfuk");

    user.token;
    user.save((err, user) => {
        if (err) return cb(err);
        cb(null, user);
    });
};

const User = mongoose.model("User", userSchema);

module.exports = {
    User
};