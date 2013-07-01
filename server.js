var express =       require('express.io')
    , http =        require('http')
    , passport =    require('passport')
    , path =        require('path')
    , User =        require('./server/models/User.js')
    ,socket = require('./server/socket.js')
    ;


//**********************************************\\
var app = express();
app.http().io();
//**********************************************\\

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


app.use(express.cookieSession(
    {
        secret: process.env.COOKIE_SECRET || "Superdupersecret"
    }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.localStrategy);
//passport.use(User.twitterStrategy());  // Comment out this line if you don't want to enable login via Twitter
//passport.use(User.facebookStrategy()); // Comment out this line if you don't want to enable login via Facebook
//passport.use(User.googleStrategy());   // Comment out this line if you don't want to enable login via Google
//passport.use(User.linkedInStrategy()); // Comment out this line if you don't want to enable login via LinkedIn

passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

require('./server/routes.js')(app);

app.set('port', process.env.PORT || 8000);
//http.createServer(app).listen(app.get('port'), function(){
//    console.log("Express server listening on port " + app.get('port'));
//});

console.log('==================== user',User );

app.server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});


var old_auth;

old_auth = app.io.get('authorization');

app.io.set("authorization", passportSocketIo.authorize({
    passport: passport,
    cookieParser: express.cookieParser, // problem
    key:    'express.sid',
    secret:  'mysecret',
    store:   mySessionStore,
    success: function(data, accept) {
        return old_auth(data, accept);
    }
}));

console.log('=below does not work if I use authorization=======');
app.io.sockets.on('connection',socket);


// old code
// Socket.io Communication
////app.io.configure(function (){
//console.log('express.cookieParser ',express.cookieParser)
//console.log('sessionConfig ',sessionConfig)

//app.io.set( "authorization", passportSocketIo.authorize({
//    passport: passport,
//    cookieParser: express.cookieParser,
//    key: config.session.key,
//    secret: config.session.secret,
//    store: config.session.store,
//    success: (data, accept(old_auth, data, accept)
//    }));
//var old_auth;
//
//old_auth = app.io.get('authorization');
//
//app.io.set("authorization", passportSocketIo.authorize({
//    passport: passport,
//    cookieParser: express.cookieParser,
//    key:    'express.sid',
//    secret:  'mysecret',
//    store:   mySessionStore,
//    success: function(data, accept) {
//        return old_auth(data, accept);
//    }
//}));
//
////    success: function(old_auth, accept){
////    console.log("success socket.io auth");
////    }
//
//
////
////    app.io.set("authorization", passportSocketIo.authorize({
////        cookieParser:express.cookieParser,
////        key:    'express.sid',
////        secret: 'secret', //the session secret to parse the cookie
////        store:   mySessionStore,     //the session store that express uses
//////        fail: function(data, accept) {
//////            // console.log("failed");
//////            // console.log(data);// *optional* callbacks on success or fail
//////            accept(null, false);             // second param takes boolean on whether or not to allow handshake
//////        },
////        success: function(data, accept) {
//////            //  console.log("success socket.io auth");
//////            //   console.log(data);
////            accept(old_autg, true);
////        }
////    }));
//////});
//
//
//
//console.log('4==========================================');
//app.io.sockets.on('connection',socket);
//
//
//
//console.log('==========================================');
//app.io.sockets.on('connection',socket);// function(socket));{JCFG});//,JCFG);
////console.log('===============socket===========================',socket);
//
//// Socket.io Communication
//app.io.set('authorization', function (data, accept) {
//    if (!data.headers.cookie)
//        return accept('No cookie transmitted.  ', false);
//    data.cookie = require('cookie').parse(data.headers.cookie, SITE_SECRET);
//    data.sessionID = data.cookie['sid'].substring(2, 26);
//    console.log('data.cookie:', data.cookie);
//    console.log('data.sessionID: ', data.sessionID);
//    mySessionStore.get(data.sessionID, function (err, session) {
//        if (err) {
//            console.log('myStore.get return error: ', err);
//            accept(err.message, false)
//        } else if (!session) {
//            console.log('This Session not found. ');
//            return accept('Session not found.', false);
//        }
//        console.log('This session: ', session, data.sessionID);
//        data.session = session;
//        accept(null, true);
//    });
//});
