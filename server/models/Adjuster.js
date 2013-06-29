var Adjuster
    , _ = require('underscore')
    , fs = require('fs')
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

            adjusters = getadjusters();
            console.log("\n\r db connected ");
        }
    }
);
function LoadConfig() {
    var cfg = {};
    try {
        fs.statSync(__dirname + '/cfg/cfg.json');
        var sCfg = fs.readFileSync(__dirname + '/cfg/cfg.json', 'utf8');
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
//var users = [
//    {
//        id:         1,
//        username:   "user",
//        password:   "123",
//        role:   userRoles.user
//    },
//    {
//        id:         2,
//        username:   "admin",
//        password:   "123",
//        role:   userRoles.admin
//    }
//];

module.exports = {


    findAll: function () {
        console.log('=====================')
        return _.map(adjusters, function (adjuster) {
            return _.clone(adjuster);
        });
        console.log('=====================')


    }
//    ,
//    findAllNoCache: function () {
//        function wrapJson(results, fields, jsondata) {
//
//            var tloop = fields;
//
//            var ftype = '';
//            _.each(tloop, function (metadesc, key) {
//                    fields[key] = metadesc.alias;
//                    ftype[key] = metadesc.type;
//                    //   console.log(fields[key], ' :', metadesc, key)
//                }
//            );
//
//            // console.log('wrapJson ', fields)
//            var maxCols = fields.length - 1;
//            var holdrow = '';
//            var fieldtype = '';
//            var fieldname = '';
//            var value = '';
//
//            _.each(_.toArray(results), function (humheader, keyheader) {
//                    holdrow = '';
//                    _.each(fields, function (num, key) {
//                            // for json and ngrid let get rid of spaces
//                            fieldname = fields[key];
//                            fieldtype = ftype[key];
//                            fieldname = fieldname.replace(/ /gi, "");// golabal replace flag gi str.replace(/<br>/gi,'\r');
//                            value = humheader[key];
//
////                    if (value != undefined )
////                    {
////                        //value = '';
////                        value =   value.replace(/\r\n/gi, "");
////                    }
//
//                            if (fieldname === 'QA_Notes') {
//                                if (value != undefined) {
//
//                                    value = value.replace(/\r\n/gi, "");
//                                    value = value.replace(/"/gi, "");
//
//                                    //value =   value.replace(/\n/gi, "");
//                                    //value =   value.replace(/\r/gi, "");
//                                }
//                            }
//                            if (fieldname === 'WebPassword') {
//
//
//                                //   wrapJson(results, fields, jsondata);
//                                if (value != undefined) {
//                                    var strct = new Array();
//
//                                    holdrow += '"role":' + userRoles.admin + ',';
//
//                                }
//                            }
//
//
//                            if (fieldname.match(/Date/gi)) {
//                                if (value != undefined) {
//                                    value = moment(value).format("MM/DD/YYYY");
//                                }
//                            }
//
//
//                            if (key == 0) {
//                                holdrow += '{"' + fieldname + '":"' + value + '",';
//                            }
//                            else if (key == maxCols) {
//                                holdrow += '"' + fieldname + '":"' + value + '"}';
//
//                            } else {
//                                //if (fieldname==='Estimated_Rev'){
//                                if (fieldtype === 496) {
//
//                                    // send integer #
//
//                                    holdrow += '"' + fieldname + '":' + value + ',';
//                                }
//                                else {
//                                    holdrow += '"' + fieldname + '":"' + value + '",';
//                                }
//                            }
//                        }
//                    );
//                    jsondata[keyheader] = JSON.parse(holdrow);
//                }
//            );
//
//            return jsondata;
//        }
//        var jsondata = new Array();
//        var CFG = LoadConfig();
//        console.log('======findAllNoCache===============',CFG)
//        fb.attachOrCreate(
//            {
//                host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
//            },
//            function (err, db) {
//                if (err) {
//                    console.log(err.message);
//                } else {
//                    database = db;
//                    console.log("\n\r findAllNoCache db connected ");
//                 //     adjusters = getadjusters();
//                   // var jsondata = new Array();
//                    qrystr = 'select ADJUSTER_ID, ADJUSTER_NAME, ADJUSTER_PHONE, ADJUSTER_EXT, "Email" from ADJUSTER where ADJUSTER_ID <20';
//                    database.execute(qrystr, function (err, results, fields) {
//                            console.log("\n\r results db connected ",results);
//                           wrapJson(results, fields, jsondata);
//                          //  console.log('adjusters',jsondata);
//                            return jsondata;
//                        },
//
//                        logerror);
//
//                }
//
//            }
//        );
//
//    }

};