const express = require('express');
const app = express();
const morgan = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }
    next();
});

const postRoutes = require('./api/routes/posts');
const commentRoutes = require('./api/routes/comments');

mongoose.connect(
    'mongodb+srv://tigeradmin:'
      + process.env.MONGO_ATLAS_PW
      + '@tigernodesandreact-4kfsd.mongodb.net/', {
        dbName: 'tigernodesandreact',
        useNewUrlParser: true
    }
);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

app.use((req, res, next) => {
    const error = new Error('Sorry, not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;