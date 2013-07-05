!
/*
 * Serve content over a socket
 */
var FBconnect
    , _ = require('underscore')
    , fs = require('fs')
    , moment = require('moment')
    , fb = require('node-firebird')

var fbconnect;
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
         //   return database;
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
                if (fieldname === 'QA_Notes') {
                    if (value != undefined) {

                        value = value.replace(/\r\n/gi, "");
                        value = value.replace(/"/gi, "");
                    }
                }
                if (fieldname === 'WebPassword') {
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
module.exports = {

    wrapJson: function (results, fields, jsondata) {
        wrapJson(results, fields, jsondata)
        return jsondata;
    },
    // i think once we define database
//    wrapJsonwithQry: function (qrystr,jsondata) {
//        //c
//        database.execute(qrystr, function (err, results, fields) {
//      //  var jsondata = new Array();
//        wrapJson(results, fields, jsondata);
//        console.log('this is wrapJsonwithQry \n\r===', jsondata);
//        return jsondata;
//    }),

      database: function() {
          var CFGs = LoadConfig();
          console.log('JJ cfg',CFGs)

            fb.attachOrCreate(
                {
                    host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
                },
                function (err, db) {
                    if (err) {
                        console.log(err.message);
                    } else {
                        database = db;
                        //return database
                       console.log("\n\r db connected ");
                    }
                }
            );

            return database;
      },
    GetUsers: function(){
        var CFG = LoadConfig();
        var jsondata = new Array();
        qrystr = 'select ID "id", "Staff Init" "username" ,"WebPassword" "password", "role" ,"AdjusterID" "adjusterid" from "Staff" where id >0';

        fb.attachOrCreate(
            {
                host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
            },
            function (err, db) {
                if (err) {
                    console.log(err.message);
                } else {
                    database = db;
                    //return database
                    console.log("\n\r db connected ");
                    database.execute(qrystr, function (err, results, fields) {
                            //    database.execute(qrystr, function (err, results, fields) {
                            console.log('database.query result "Staff"  ', results);

                            wrapJson(results, fields, jsondata);
                        },
                        logerror);
                }
            }
        );

        return jsondata;
},
    GetAdjusters: function(){
        var CFG = LoadConfig();
        var jsondata = new Array();
        qrystr = 'select ADJUSTER_ID, ADJUSTER_NAME, ADJUSTER_PHONE, ADJUSTER_EXT, "Email" from ADJUSTER where ADJUSTER_ID >0';

        fb.attachOrCreate(
            {
                host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
            },
            function (err, db) {
                if (err) {
                    console.log(err.message);
                } else {
                    database = db;
                    //return database
                    console.log("\n\r db connected ");
                    database.execute(qrystr, function (err, results, fields) {
                            //    database.execute(qrystr, function (err, results, fields) {
                            console.log('database.query result "Staff"  ', results);

                            wrapJson(results, fields, jsondata);
                        },
                        logerror);
                }
            }
        );

        return jsondata;
    },


     getadjusters: function() {
    var jsondata = new Array();
    qrystr = 'select ADJUSTER_ID, ADJUSTER_NAME, ADJUSTER_PHONE, ADJUSTER_EXT, "Email" from ADJUSTER where ADJUSTER_ID >0';
    //firebird.dbConn().
        database.execute(qrystr, function (err, results, fields) {
            console.log('database.query result "Staff"  ', results);

            firebird.wrapJson(results, fields, jsondata);

        },
        logerror);
    return jsondata;
     }




//    ,     CFG:function(){
//        return CFG= LoadConfig()
//     }

};
