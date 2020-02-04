const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {
        const candidate = await User.findOne({ email });
        if (!candidate) {
            res.status(404).json({
                message: 'incorrect email or password'
            });
        }
        const passwordResult = bcrypt.compareSync(password, candidate.password);
        if (passwordResult) {
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, config.jwt, {
                expiresIn: 60 * 60
            });

            res.status(200).json({
                token: `Bearer ${token}`
            });

        } else {
            res.status(401).json({
                message: 'incorrect email or password'
            });
        }
    } else {
        res.status(404).json({
            message: 'enter email and password'
        });
    }
};

module.exports.register = async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {
        const candidate = await User.findOne({ email });
        if (candidate) {
            res.status(409).json({
                message: 'User alredy exists'
            });
        }
        const salt = bcrypt.genSaltSync(10);
        const user = new User({
            email,
            password: bcrypt.hashSync(password, salt)
        });
        try {
            await user.save();
            res.status(201).json(user);
        } catch (e) {
            errorHandler(res, e);
        }
    } else {
        res.status(409).json({
            message: 'Enter login and password'
        });
    }
};