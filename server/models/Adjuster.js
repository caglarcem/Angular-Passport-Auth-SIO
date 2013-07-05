var Adjuster
    , _ = require('underscore')
    , fs = require('fs')
    , fb = require('node-firebird')
    , firebird = require('../firebird.js')  ;
// , express = require('express.io');
// modified for Firebird by JRT
var adjusters;
//adjusters = firebird.GetAdjusters();//  firebird.GetAdjusters();//getadjusters();
////function getadjusters() {
////    console.log('======getadjusters===============')
////
////    var jsondata = new Array();
////    qrystr = 'select ADJUSTER_ID, ADJUSTER_NAME, ADJUSTER_PHONE, ADJUSTER_EXT, "Email" from ADJUSTER where ADJUSTER_ID <20';
////    firebird.database().execute(qrystr, function (err, results, fields) {
////            firebird.wrapJson(results, fields, jsondata);
////
////        },
////        logerror);
////    console.log('======getadjusters===============',jsondata)
////
////    return jsondata;
////};

//
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
//            adjusters = getadjusters();
//            console.log("\n\r db connected ");
//        }
//    }
//);
//function LoadConfig() {
//    var cfg = {};
//    try {
//        fs.statSync(__dirname + '/cfg/cfg.json');
//        var sCfg = fs.readFileSync(__dirname + '/cfg/cfg.json', 'utf8');
//        cfg = JSON.parse(sCfg);
//        console.log('CFG ', __dirname);
//    }
//    catch (e) {
//        console.log("Error loading config " + e.message)
//    }
//    return cfg;
//};
//
//
//function getadjusters() {
//    console.log('======getadjusters===============')
//
//    var jsondata = new Array();
//    qrystr = 'select ADJUSTER_ID, ADJUSTER_NAME, ADJUSTER_PHONE, ADJUSTER_EXT, "Email" from ADJUSTER where ADJUSTER_ID <20';
//    database.execute(qrystr, function (err, results, fields) {
//            firebird.wrapJson(results, fields, jsondata);
//
//        },
//        logerror);
//    console.log('======getadjusters===============',jsondata)
//
//    return jsondata;
//};
//
//
//function logerror(err) {
//    console.log(err.message);
//}
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
};
