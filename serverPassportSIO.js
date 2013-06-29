var express = require('express.io')
//   , http =        require('http')
    , passport = require('passport')
    , path = require('path')
    , User = require('./server/models/User.js')
// , DB = require('./accessDB').AccessDB
//, socketIo = require("socket.io")
    ,socket = require('./server/socket.js')

    , fs = require('fs')
    , passportSocketIo = require("passport.socketio")
    ;

//var cookie = require('cookie');
var SITE_SECRET = 'orextkey';

//**********************************************\\
var app = express();
app.http().io();
//**********************************************\\


//define session store
var MemStore = express.session.MemoryStore;
var mySessionStore = new express.session.MemoryStore({reapInterval: 60000 * 10});
app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'))
app.use(express.cookieParser(SITE_SECRET));
//app.use(express.session({
//    store:mySessionStore,
//    key:'sid',
//    secret:'orextkey'
//}));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.cookieSession(
    {
        secret: "Superdupersecret"
    }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.localStrategy);
//passport.use(User.twitterStrategy());  // Comment out this line if you don't want to enable login via Twitter
//passport.use(User.facebookStrategy()); // Comment out this line if you don't want to enable login via Facebook
//passport.use(User.googleStrategy());   // Comment out this line if you don't want to enable login via Google
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);
app.use(express.session({secret: 'totallysecret', store: mySessionStore })),
    require('./server/routes.js')(app);
var sessionobj = {};
// socket = require('./server/socket.js')(app);
app.configure(function(){
    app.set('port', process.env.PORT || 8000);
});
app.server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

app.io.configure(function (){
    if (app.username === 'JRT') //username user routes.l login. )
    {
    app.io.set("authorization", passportSocketIo.authorize({
        key:    'express.sid',       //the cookie where express (or connect) stores its session id.
        secret:SITE_SECRET, //the session secret to parse the cookie
        store:   mySessionStore,     //the session store that express uses
        cookieParser: express.cookieParser,
        fail: function(data, accept) {
            // console.log("failed");
            // console.log(data);// *optional* callbacks on success or fail
            accept(null, false);             // second param takes boolean on whether or not to allow handshake
        },
        success: function(data, accept) {
            //  console.log("success socket.io auth");
            //   console.log(data);
            accept(null, true);
        }
    }));
    }
});


console.log('==========================================');
app.io.sockets.on('connection',socket);// function(socket));{JCFG});//,JCFG);
console.log('===============socket===========================',socket);
