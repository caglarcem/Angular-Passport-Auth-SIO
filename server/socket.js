/*
 * Serve content over a socket
 */
//var Adjusters
var  _ = require('underscore');
var  firebird = require('./firebird.js');
//    , fs = require('fs')
//    , moment = require('moment')
//    , fb = require('node-firebird')
//    , User = require('./models/User.js')
//    , UserCtrl = require('./controllers/user')
//    , AuthCtrl = require('./controllers/auth')
//    , passport = require('passport')

//    , async = require('async')
// , q = require('q');

// modified for Firebird by JRT
//var adjusters;
////
//var CFG = LoadConfig();
//fb.attachOrCreate(
//    {
//        host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
//    },
//    function (err, db) {
//        if (err) {
//            console.log(err.message);
//        } else {
//            database = db;
//
//            //  adjusters = getadjusters();
//            console.log("\n\r db connected ");
//        }
//    }
//);
//function LoadConfig() {
//    var cfg = {};
//    try {
//        fs.statSync(__dirname + '/models/cfg/cfg.json');
//        var sCfg = fs.readFileSync(__dirname + '/models/cfg/cfg.json', 'utf8');
//        cfg = JSON.parse(sCfg);
//        console.log('CFG ', __dirname);
//    }
//    catch (e) {
//        console.log("Error loading config " + e.message)
//    }
//    return cfg;
//};
//
//function logerror(err) {
//    console.log(err.message);
//}

module.exports = function (socket) {
    var user = socket.handshake.session;//.user_id;
    console.log('==user1==================', user);
    console.log('==user1=PASSPORT=================', user.passport.user);
    console.log('socketapp ');//.sio)
    console.log('====================');

    socket.emit('send:name', {
        name: 'Bob',
        name3: 'Bob3'
    });
    socket.emit('send:name3', {

        name3: 'Bob3'

    });

    setInterval(function () {
        socket.emit('send:time', {
            time: (new Date()).toString(),
            namet: 'John'
        });


    }, 1000);

    socket.on('getAdjusters', function (data) {
        var user = socket.handshake.session;//.user_id;
        var adj = user.req.session.req.user.adjusterid;
        console.log('====2user2================', adj);//socket.handshake.req.user);//  session.req.user);//,' ',user.passport.adjusterid);//socket.handshake.session.req.session.req.user);// .session.req.session.req.user);// passport);//.username);

        qrystr = 'select ADJUSTER_ID, ADJUSTER_NAME, ADJUSTER_PHONE, ADJUSTER_EXT, "Email" from ADJUSTER where ADJUSTER_ID <20';

        console.log('c: ', qrystr);
        console.log('==============================================================');
        //firebird.database().execute(qrystr, function (err, results, fields) {
            database.execute(qrystr, function (err, results, fields) {
        var jsondata = new Array();
        firebird.wrapJson(results, fields, jsondata);
            output = {"Adjusters": jsondata};
            socket.emit('initAdjusters', output);
            //console.log('=====from socket wrapJsonwithQry========',jsondata);

  //      jsondata=  getClaims();
//        getClaims().then(function(result){
//            console.log('=====from socket wrapJsonwithQry========',result,jsondata);
        })

    });

//        getClaims =  function () {
//            if (deferred === null) {
//                initClaims();
//            }
//            return deferred.promise;
//        }
//        initClaims = function () {
//            deferred = q.defer();
//            setTimeout(function () {
//                firebird.wrapJsonwithQry( qrystr,jsondata)
//                deferred.resolve(jsondata);
//            }, 1000);
//            return deferred.promise;
//
//        } });



//   var task= firebird.wrapJsonwithQry( qrystr, jsondata);
//        var q = async.queue(function ( firebird.wrapJsonwithQry( qrystr, jsondata), callback) {
//            console.log('hello ' + task.name);
//            callback();
//        }, 2);
//    async. series([firebird.wrapJsonwithQry( qrystr, jsondata)]);
//    jsondata2=;
//        async.parallel({
//                jsondata: firebird.wrapJsonwithQry( qrystr))//;;, jsondata)
//                //,        titles: queryRow('title', 'code_samples')
//            },
//   function(result) {
//                console.log('=====from socket wrapJsonwithQry========',result.jsondata);
////                res.render('home.ejs', {
////                    layout: false,
////                    locals: {user_name: result.users, title: result.titles}
////                });
//   });
//   var outputPromise = firebird.wrapJsonwithQry( qrystr)
//        then(console.log(outputPromise)) {
//   });
//   var deferred = q.defer();
//   FS.readFile("foo.txt", "utf-8", deferred.makeNodeResolver());
//   deferred.firebird.wrapJsonwithQry( qrystr,jsondata)
//   return deferred.promise;
//   initClaims();
//   async.series([
//   output = {"Adjusters": jsondata};
//       socket.emit('initAdjusters', output);
//   });

    socket.on('getClaimsAdminColumns', function (data) {
        var user = socket.handshake.session.user_id;
        qrystr = util.format('select first 1 "GridForm","SortInfo","StaffInit" from "WebGrid" where "GridID"=1 and ("StaffInit"=%s or  "StaffInit"=%s)  order by  "StaffInit" desc', "'" + user + "'", "'" + '0' + "'");
        console.log('======================== ');
        console.log('qrystr ', qrystr);
        console.log('======================== ');
        firebird.database.query(qrystr, function (err, results, fields) {
            if (results != undefined) {
                jsondata = JSON.parse(results[0][0]);// get Cols
            } else {

            }

            output = {"ClaimsAdminColumns": jsondata};
            socket.emit('initClaimsAdminColumns', output);
            console.log('results ', util.inspect(results));
        });
    });
    socket.on('sendClaimsAdminGrid', function (data) {
        var user = socket.handshake.session.user_id;
        insertstr = ' execute procedure "WebGrid_IU"(?,?,?)';
        console.log('  insertstr ', insertstr);
        firebird.database.query(insertstr, [  1, JSON.stringify(data), user ], function (err, results, fields) {//,user
            jsondata = {'data ': 'this is response1'};
            output = {"responseClaimsAdminGrid": jsondata};
            socket.emit('responseClaimsAdminGrid', output);
            console.log('responseClaimsAdminGrid  ', output);
        });
    });
    socket.on('getcodeTypes', function (data) {
        qrystr = 'select CLAIM_TYPE_DESC "name", CLAIM_TYPE_ID "id" from CLAIM_TYPE  order by CLAIM_TYPE_DESC';
        console.log('qrystr: ', qrystr);
        console.log('==============================================================');
        console.log('===================getcodeTypes===============================');
        firebird.database().execute(qrystr, function (err, results, fields) {
            var jsondata = new Array();
//            wrapJson(results, fields, jsondata);
            firebird.wrapJson(results, fields, jsondata);
            output = {"Code1": jsondata};
            socket.emit('initcode1', output);
        });
    });
    socket.on('getcodeService', function (data) {
        qrystr = 'select sort_no "id", description "name" from code where code_type_id =1  order by  description';
        console.log('qrystr: ', qrystr);
        console.log('==============================================================');
        firebird.database().execute(qrystr, function (err, results, fields) {
            var jsondata = new Array();
            //wrapJson(results, fields, jsondata);
            firebird.wrapJson(results, fields, jsondata);

            output = {"Code2": jsondata};
            socket.emit('initcode2', output);
        });
    });
    socket.on('getcodeExpense', function (data) {
        qrystr = 'select sort_no "id", description "name" from code where code_type_id =3   order by code_type_id,description';
        console.log('qrystr: ', qrystr);
        console.log('==============================================================');
        firebird.database().execute(qrystr, function (err, results, fields) {
            var jsondata = new Array();
//            wrapJson(results, fields, jsondata);
            firebird.wrapJson(results, fields, jsondata);
            output = {"Code3": jsondata};
            socket.emit('initcode3', output);
        });
    });
    socket.on('getclaims', function (data) {
        var user = socket.handshake.session;//.user_id;
        var adj = user.req.session.req.user.adjusterid;
        console.log('======getclaims - UserCtrl===============', adj);//  () User.user)
        console.log('jrt==========adj ', adj)
        qrystr = 'select CLAIM_ID "id", CLAIM_NO "title" , INSURED_ID, CLAIM_TYPE "type", ADJUSTER_ID, ACCOUNT_REP_ID "reporter" , INSURANCE_COMPANY_ID "assignee"  , \
            description,status "status",   DATE_OF_LOSS, POLICY_NUMBER,REPORTED,RECOVERY_COMMENTS,RECEIVED from CLAIM where ADJUSTER_ID= ? and status = 1 ';
        console.log('qrystr: ', qrystr, [adj ]);
        console.log('==============================================================');

        //firebird.database().execute(qrystr, [adj], function (err, results, fields) {
            database.execute(qrystr, [adj], function (err, results, fields) {
            var jsondata = new Array();
            //wrapJson(results, fields, jsondata);
            firebird.wrapJson(results, fields, jsondata);

            output = {"Claims": jsondata};
            socket.emit('initclaims', output);
        });

    });
    socket.on('getdaily', function (data) {
    //    console.log(User, passport, UserCtrl)
    //    var juser = User.localStrategy;//.username;/// deserializeUser();// passport.deserializeUser();// User.localStrategy.session      // socket.handshake.session.user_id;
   //     console.log('==juser=========', juser);
   //     console.log('============\n');
        var newkey;
        qrystr = 'select DD.DAILY_DETAIL_ID, DD.DAILY_ID, DD.WORK_DATE, DD.WORK_DESCRIPTION, DD.SERVICE_ID, DD.MILEAGE, DD.EXPENSE, \
                DD.EXPENSE_TYPE_ID, DD.WORK_TIME, DD.AR_ID, DD.AR_DATE, DD.CLAIM_ID, DD.CLAIM_NO, DD.WEEKOF , c1.description "servicedesc",c2.description "expensedesc"  \
                from DAILY_DETAIL DD \
                left join DAILY D on \
                DD.DAILY_ID= D.DAILY_ID \
                left join code c1 on \
                c1.sort_no= DD.SERVICE_ID \
                left join code c2 on \
                c2.sort_no= DD.EXPENSE_TYPE_ID \
                where DD.CLAIM_NO=  ? \
                and dd.ar_id is null';
        //firebird.database().execute(qrystr, [data.title], function (err, results, fields) {
           database.execute(qrystr, [data.title], function (err, results, fields) {
            if (results != '') {
                var jsondata = new Array();
                firebird.wrapJson(results, fields, jsondata);
                output = {"Daily": jsondata};
            } else {
                output = 'Empty';//
            }
            socket.emit('initdaily', output);
        });
    });
    socket.on('getdailybydate', function (data) {
        // var adj = socket.handshake.session.adjuster_id;
        var adj = 135;
        console.log('============');
        console.log('getdailybydate  data:', data);//.ADJUSTER_ID);//.WORK_DATE, data);
        console.log('============\n');
        var newkey;
        qrystr = 'select DD.DAILY_DETAIL_ID, DD.DAILY_ID, DD.WORK_DATE, DD.WORK_DESCRIPTION, DD.SERVICE_ID, DD.MILEAGE, DD.EXPENSE, \
                 DD.EXPENSE_TYPE_ID, DD.WORK_TIME, DD.AR_ID, DD.AR_DATE, DD.CLAIM_ID, DD.CLAIM_NO, DD.WEEKOF   \
                  , c1.description "servicedesc",c2.description "expensedesc"  \
                from DAILY_DETAIL DD \
                left join CLAIM C on \
                DD.CLAIM_NO= C.CLAIM_NO \
                left join code c1 on \
                c1.sort_no= DD.SERVICE_ID \
                left join code c2 on \
                c2.sort_no= DD.EXPENSE_TYPE_ID \
                where ((DD.WORK_DATE >= ? and DD.WORK_DATE <= ?) and C.ADJUSTER_ID=?) ';
        firebird.database().execute(qrystr, [moment(data.SET_WORK_DATE1).format("MM/DD/YYYY") , moment(data.SET_WORK_DATE2).format("MM/DD/YYYY"), adj], function (err, results, fields) {
            var jsondata = new Array();
            firebird.wrapJson(results, fields, jsondata);
            output = {"Daily": jsondata};
            console.log('jsondata-1.', output);
            socket.emit('initdailybydate', output);
        });
    });
    socket.on('senddaily', function (data) {
        var newkey;
        var str = data.DAILY_DETAIL_ID + "','" + data.DAILY_ID + "','" + data.WORK_DATE + "','" + data.WORK_DESCRIPTION + "','" + data.SERVICE_ID + "','" + data.MILEAGE + "','" + data.EXPENSE + "','" + data.EXPENSE_TYPE_ID + "','" + data.WORK_TIME + data.CLAIM_NO + "'";
        console.log('=====data parts =======', str);
        if (data.DAILY_DETAIL_ID === 'new') {
            data.DAILY_DETAIL_ID = -1;
            console.log('insert========== ==', data.DAILY_DETAIL_ID);
        } else
            console.log('update============', data.DAILY_DETAIL_ID);

        console.log(data.DAILY_DETAIL_ID, data.DAILY_ID, data.WORK_DATE, data.WORK_DESCRIPTION, data.SERVICE_ID, data.MILEAGE, data.EXPENSE, data.EXPENSE_TYPE_ID, data.WORK_TIME, data.CLAIM_NO);
        firebird.database().execute('select NEWID  from  DAILY_DETAIL_IU (?,?,?,?,?, ?,?,?,?,?)', [data.DAILY_DETAIL_ID, data.DAILY_ID, data.WORK_DATE, data.WORK_DESCRIPTION, data.SERVICE_ID, data.MILEAGE, data.EXPENSE, data.EXPENSE_TYPE_ID, data.WORK_TIME, data.CLAIM_NO], // success
            function (err, results, fields) {
                _.each(results, function (num, key) {
                        console.log('n k ', num, key, num[0]);
                        newkey = num[0];
                    }
                )
                output = {"result": newkey}; // resultx
                console.log('output-1.', output);
                socket.emit('responsedaily', output);
            })
    });
    socket.on('getcode27', function (data) {
        qrystr = ' SELECT "Description" "text", "String Value"  "value" FROM SP_CODES(27,1)';

        firebird.database().execute(qrystr, function (err, results, fields) {
            var jsondata = new Array();
//            wrapJson(results, fields, jsondata);
            firebird.wrapJson(results, fields, jsondata);
            output = {"Code27": jsondata};
            console.log(' output 27 ', output)
            socket.emit('initcode27', output);
        });
    });
    socket.on('getClaimsAdmin', function (data) {
        console.log('io.sockets.on for getprojet. data:  ', data);
        console.log('=========================================================== ');
        qrystr = 'select   DAILY_DETAIL_ID,  DAILY_ID,   WORK_DATE,\
                WORK_DESCRIPTION,                 SERVICE_ID,                MILEAGE,                EXPENSE,\
                EXPENSE_TYPE_ID,                  WORK_TIME,                AR_ID,                AR_DATE,\
                CLAIM_ID,                 CLAIM_NO,                WEEKOF,                "servicedesc",\
                "expensedesc",                ADJUSTER_NAME,                LEGAL_NAME,                COMMON_NAME,                NAME\
                from MAN1_VIEW\
             where (WORK_DATE >= ? and WORK_DATE <= ?)  ';
        firebird.database().execute(qrystr, [moment(data.dtStart).format("MM/DD/YYYY") , moment(data.dtEnd).format("MM/DD/YYYY")], function (err, results, fields) {
            var jsondata = new Array();
//            wrapJson(results, fields, jsondata);
            firebird.wrapJson(results, fields, jsondata);
           // console.log('\n\r===', jsondata.length);
            output = {"ClaimsAdmin": jsondata};
            socket.emit('initClaimsAdmin', output);
        });
    });
    socket.on('sendclaimsadmin', function (data) {
        console.log('============');
        console.log('io.sockets.on for sendclaimsadmin. data:', data);
        console.log('============');
        if (socket.handshake !== undefined && socket.handshake.session !== undefined) {
            var user = socket.handshake.session.user_id;
            if (data.ID == -1) {
               console.log('insert============');
            }
            else {
                console.log('in up ', data)
                firebird.database().execute('update PT_MPS  set  "QA Notes" = ? ,"State" = ? where PROJECT_ID = ?', [data.QA_Notes , data.State , data.ID], function (err, results) {
                        output = {"result": 'update'}; // resultx
                        console.log('output.', output, err, results);
                        socket.emit('responseclaimsadmin', output);
                    }
                )

            }
        }
    });
};
