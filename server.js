var express =       require('express.io')
    , http =        require('http')
    , passport =    require('passport')
    , path =        require('path')
    , User =        require('./server/models/User.js')
    , socket = require('./server/socket.js')
    , passportSocketIo = require("passport.socketio")
    , config = require('express-config');

//**********************************************\\
var app = express();
app.http().io();
//**********************************************\\
app.io.route('private', function(req) {
    console.log(req.handshake.user);
});

app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'))
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'client')));

//define session store
var MemStore = express.session.MemoryStore;
var mySessionStore = new express.session.MemoryStore({reapInterval: 60000 * 10});
app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

// this breaks the code
//app.use(express.cookieSession(
//    {
//        //secret: process.env.COOKIE_SECRET || "Superdupersecret"
//        secret: "Superdupersecret"
//    }));

//app.use(express.session({
//    key: config.session.key,
//    secret: config.session.secret,
//    store: config.session.store
//}));

app.use(express.session({
    key:    'express.sid',
    secret:  'mysecret',
    store:   mySessionStore
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.localStrategy);
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);
require('./server/routes.js')(app);


app.set('port', process.env.PORT || 8000);
app.server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

// the following 2 lines were proved by  mike from 'techpines/express.io'
var old_auth;
old_auth = app.io.get('authorization');

app.io.set("authorization", passportSocketIo.authorize({
    passport: passport,
    cookieParser: express.cookieParser,
    key:    'express.sid',
    secret:  'mysecret',
    store:   mySessionStore,
    success: function(data, accept) {
        return old_auth(data, accept);
    }
}));
//

app.io.sockets.on('connection',socket);

