/*
 * Serve content over a socket
 */
var Adjusters
    , _ = require('underscore')

    , fs = require('fs')
    , moment = require('moment')
    , fb = require('node-firebird');
// , express = require('express.io');
// modified for Firebird by JRT
var adjusters;
////
var CFG = LoadConfig();
fb.attachOrCreate(
    {
        host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
    },
    function (err, db) {
        if (err) {
            console.log(err.message);
        } else {
            database = db;

          //  adjusters = getadjusters();
            console.log("\n\r db connected ");
        }
    }
);
function LoadConfig() {
    var cfg = {};
    try {
        fs.statSync(__dirname + '/models/cfg/cfg.json');
        var sCfg = fs.readFileSync(__dirname + '/models/cfg/cfg.json', 'utf8');
        cfg = JSON.parse(sCfg);
        console.log('CFG ', __dirname);
    }
    catch (e) {
        console.log("Error loading config " + e.message)
    }
    return cfg;
};


function getadjusters() {
    console.log('======getadjusters===============')

    var jsondata = new Array();
    qrystr = 'select ADJUSTER_ID, ADJUSTER_NAME, ADJUSTER_PHONE, ADJUSTER_EXT, "Email" from ADJUSTER where ADJUSTER_ID <20';
    database.execute(qrystr, function (err, results, fields) {
            // console.log('database.query result "Staff"  ', results);

            wrapJson(results, fields, jsondata);
//            output = {"Code1": jsondata};
//            users =     jsondata;
//            console.log('users ',users)
        },
        logerror);
    console.log('======getadjusters===============',jsondata)

    return jsondata;
};


function logerror(err) {
    console.log(err.message);
}
function wrapJson(results, fields, jsondata) {

    var tloop = fields;

    var ftype = '';
    _.each(tloop, function (metadesc, key) {
            fields[key] = metadesc.alias;
            ftype[key] = metadesc.type;
            //   console.log(fields[key], ' :', metadesc, key)
        }
    );

    // console.log('wrapJson ', fields)
    var maxCols = fields.length - 1;
    var holdrow = '';
    var fieldtype = '';
    var fieldname = '';
    var value = '';

    _.each(_.toArray(results), function (humheader, keyheader) {
            holdrow = '';
            _.each(fields, function (num, key) {
                    // for json and ngrid let get rid of spaces
                    fieldname = fields[key];
                    fieldtype = ftype[key];
                    fieldname = fieldname.replace(/ /gi, "");// golabal replace flag gi str.replace(/<br>/gi,'\r');
                    value = humheader[key];

//                    if (value != undefined )
//                    {
//                        //value = '';
//                        value =   value.replace(/\r\n/gi, "");
//                    }

                    if (fieldname === 'QA_Notes') {
                        if (value != undefined) {

                            value = value.replace(/\r\n/gi, "");
                            value = value.replace(/"/gi, "");

                            //value =   value.replace(/\n/gi, "");
                            //value =   value.replace(/\r/gi, "");
                        }
                    }
                    if (fieldname === 'WebPassword') {


                        //   wrapJson(results, fields, jsondata);
                        if (value != undefined) {
                            var strct = new Array();

                            holdrow += '"role":' + userRoles.admin + ',';

                        }
                    }


                    if (fieldname.match(/Date/gi)) {
                        if (value != undefined) {
                            value = moment(value).format("MM/DD/YYYY");
                        }
                    }


                    if (key == 0) {
                        holdrow += '{"' + fieldname + '":"' + value + '",';
                    }
                    else if (key == maxCols) {
                        holdrow += '"' + fieldname + '":"' + value + '"}';

                    } else {
                        //if (fieldname==='Estimated_Rev'){
                        if (fieldtype === 496) {

                            // send integer #

                            holdrow += '"' + fieldname + '":' + value + ',';
                        }
                        else {
                            holdrow += '"' + fieldname + '":"' + value + '",';
                        }
                    }
                }
            );
            jsondata[keyheader] = JSON.parse(holdrow);
        }
    );

    return jsondata;
}
module.exports = function (socket,JCFG) {
 //   console.log(socket.name3)
    console.log('====================');
    console.log('socketapp ',JCFG);//.sio)
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
        qrystr = 'select ADJUSTER_ID, ADJUSTER_NAME, ADJUSTER_PHONE, ADJUSTER_EXT, "Email" from ADJUSTER where ADJUSTER_ID <20';

        console.log('qrystr: ', qrystr);
        console.log('==============================================================');
        database.execute(qrystr, function (err, results, fields) {
            var jsondata = new Array();
            // console.log('\n\rThese are the fields======================== ============================', fields);

            wrapJson(results, fields, jsondata);
            output = {"Adjusters": jsondata};
            socket.emit('initAdjusters', output);
        });
    });

//    socket.on('getcodeTypes', function (data) {
//        qrystr = 'select CLAIM_TYPE_DESC "name", CLAIM_TYPE_ID "id" from CLAIM_TYPE  order by CLAIM_TYPE_DESC'
//        console.log('qrystr: ', qrystr);
//        console.log('==============================================================');
//        console.log('===================getcodeTypes===============================');
//        database.execute(qrystr, function (err, results, fields) {
//            var jsondata = new Array();
//            // console.log('\n\rThese are the fields====================================================', fields);
//
//            wrapJson(results, fields, jsondata);
//            output = {"Code1": jsondata};
//            socket.emit('initcode1', output);
//        });
//    });

    socket.on('getClaimsAdminColumns', function (data) {
        var user = socket.handshake.session.user_id;
        qrystr = util.format('select first 1 "GridForm","SortInfo","StaffInit" from "WebGrid" where "GridID"=1 and ("StaffInit"=%s or  "StaffInit"=%s)  order by  "StaffInit" desc', "'" + user + "'", "'" + '0' + "'");
        console.log('======================== ');
        console.log('qrystr ', qrystr);
        console.log('======================== ');
        database.query(qrystr, function (err, results, fields) {
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
        database.query(insertstr, [  1, JSON.stringify(data), user ], function (err, results, fields) {//,user
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
        database.execute(qrystr, function (err, results, fields) {
            var jsondata = new Array();
            wrapJson(results, fields, jsondata);
            output = {"Code1": jsondata};
            socket.emit('initcode1', output);
        });
    });

    socket.on('getcodeService', function (data) {
        qrystr = 'select sort_no "id", description "name" from code where code_type_id =1  order by  description';
        console.log('qrystr: ', qrystr);
        console.log('==============================================================');
        database.execute(qrystr, function (err, results, fields) {
            var jsondata = new Array();
            wrapJson(results, fields, jsondata);
            output = {"Code2": jsondata};
            socket.emit('initcode2', output);
        });
    });

    socket.on('getcodeExpense', function (data) {
        qrystr = 'select sort_no "id", description "name" from code where code_type_id =3   order by code_type_id,description';
        console.log('qrystr: ', qrystr);
        console.log('==============================================================');
        database.execute(qrystr, function (err, results, fields) {
            var jsondata = new Array();
            wrapJson(results, fields, jsondata);
            output = {"Code3": jsondata};
            socket.emit('initcode3', output);
        });
    });

    socket.on('getclaims', function (data) {
        //var adj = socket.handshake.session.adjuster_id;
        var adj =135;
            console.log('jrt==========adj ',adj )
        qrystr = 'select CLAIM_ID "id", CLAIM_NO "title" , INSURED_ID, CLAIM_TYPE "type", ADJUSTER_ID, ACCOUNT_REP_ID "reporter" , INSURANCE_COMPANY_ID "assignee"  , \
            description,status "status",   DATE_OF_LOSS, POLICY_NUMBER,REPORTED,RECOVERY_COMMENTS,RECEIVED from CLAIM where ADJUSTER_ID= ? and status = 1 ';
        console.log('qrystr: ', qrystr,[adj ]);
        console.log('==============================================================');


        database.execute(qrystr,[adj], function (err, results, fields) {
            var jsondata = new Array();
            wrapJson(results, fields, jsondata);
            output = {"Claims": jsondata};
            socket.emit('initclaims', output);
        });

    });



    socket.on('getdaily', function (data) {
        console.log('========== ==');
        console.log('getdailiy. data:', data.title, data);
        console.log('============\n');
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
                where DD.CLAIM_NO=  ? ';
        database.execute(qrystr, [data.title], function (err, results, fields) {
            var jsondata = new Array();
            wrapJson(results, fields, jsondata);
            output = {"Daily": jsondata};
            console.log('jsondata-1.', output);
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
        database.execute(qrystr, [moment(data.SET_WORK_DATE1).format("MM/DD/YYYY") , moment(data.SET_WORK_DATE2).format("MM/DD/YYYY"), adj], function (err, results, fields) {
            var jsondata = new Array();
            wrapJson(results, fields, jsondata);
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
        database.execute('select NEWID  from  DAILY_DETAIL_IU (?,?,?,?,?, ?,?,?,?,?)', [data.DAILY_DETAIL_ID, data.DAILY_ID, data.WORK_DATE, data.WORK_DESCRIPTION, data.SERVICE_ID, data.MILEAGE, data.EXPENSE, data.EXPENSE_TYPE_ID, data.WORK_TIME, data.CLAIM_NO], // success
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

        database.execute(qrystr, function (err, results, fields) {
            var jsondata = new Array();
            wrapJson(results, fields, jsondata);
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
        database.execute(qrystr, [moment(data.dtStart).format("MM/DD/YYYY") , moment(data.dtEnd).format("MM/DD/YYYY")], function (err, results, fields) {
            var jsondata = new Array();
            wrapJson(results, fields, jsondata);
            console.log('\n\r===', jsondata.length);

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
                   database.execute('update PT_MPS  set  "QA Notes" = ? ,"State" = ? where PROJECT_ID = ?', [data.QA_Notes , data.State , data.ID], function (err, results) {

                        output = {"result": 'update'}; // resultx
                        console.log('output.', output, err, results);
                        socket.emit('responseclaimsadmin', output);
                    }
                )

            }

        }
    });


};
