const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/keys');
const authMiddleware = require('./middleware/passport');

mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use((req, res, next) => {
    authMiddleware(passport);
    next();
})

app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/analytics', passport.authenticate('jwt', { session: false }), analyticsRoutes);
app.use('/api/category', passport.authenticate('jwt', { session: false }), categoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', passport.authenticate('jwt', { session: false }), positionRoutes);

module.exports = app;