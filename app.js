var express = require('express');
var path = require('path')
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require ('cookie-parser');
var bodyParser = require ('body-parser');
var expressHbs = require ('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require ('connect-mongo')(session);

//Get index
var routes = require('./routes/index');
var userRoutes = require('./routes/user');

//Start express
var app = express();

//Connect to database
mongoose.connect('mongodb://localhost/shopping', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

//Just require passport 
require('./config/passport')

//view setup engine 
app.engine('.hbs', expressHbs( {defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

//Middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator()); 
app.use(cookieParser());
//Store session on MongoStore instead locally
app.use(session({
    secret:'mysupersecret', 
    resave: false, 
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection}),
    cookie: { maxAge: 180*60*1000 } //Set time cookies is alive ==> 3 hrs
}));

//After session --> Important order matters (passport and flash) -- Flash messages to user
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); 
app.use(express.static(path.join(__dirname, 'public')));

//Set gloabal variable for views - Set headers 
app.use(function(req, res, next){
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session; //Make acessible on views
    next();
});

//App use routes - Redirect to user page
app.use('/user', userRoutes);

//App use index page
app.use('/', routes);

//Error 404 and forward to error handler
app.use(function(req, res, next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development'){ 
    app.use(function (err, req, res, next) {
        res.status(err.status || 500 );
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//Start server
app.listen(3000, function(){
    console.log('Server started...');     
});