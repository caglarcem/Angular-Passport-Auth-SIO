//;var Private
var _ =  require('underscore');

var fs = require('fs');
var  fb = require('node-firebird');
var firebird = require('../firebird.js')  ;
   // , express = require('express.io');

// modified for Firebird by JRT
//var adjusters;
////
users = firebird.getadjusters();

////
////var CFG = LoadConfig();
////fb.attachOrCreate(
////    {
////        host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
////    },
////    function (err, db) {
////        if (err) {
////            console.log(err.message);
////        } else {
////            database = db;
////            //   getusers();
////            adjusters = getadjusters();
////            console.log("\n\r db connected ");
////        }
////    }
////);
////function LoadConfig() {
////    var cfg = {};
////    try {
////        fs.statSync(__dirname + '/cfg/cfg.json');
////        var sCfg = fs.readFileSync(__dirname + '/cfg/cfg.json', 'utf8');
////        cfg = JSON.parse(sCfg);
////        console.log('CFG ', __dirname);
////    }
////    catch (e) {
////        console.log("Error loading config " + e.message)
////    }
////    return cfg;
////};
//
//
//function getadjusters() {
//    var jsondata = new Array();
//    qrystr = 'select ADJUSTER_ID, ADJUSTER_NAME, ADJUSTER_PHONE, ADJUSTER_EXT, "Email" from ADJUSTER where ADJUSTER_ID >0';
//    //firebird.dbConn().
//        database.execute(qrystr, function (err, results, fields) {
//            console.log('database.query result "Staff"  ', results);
//
//            firebird.wrapJson(results, fields, jsondata);
//
//        },
//        logerror);
//    return jsondata;
//};


function logerror(err) {
    console.log(err.message);
}

module.exports = {


    findAll: function() {
        return _.map(adjusters, function(adjuster) { return _.clone(adjuster); });
    },

    findById: function(id) {
        return _.clone(_.find(adjusters, function(adjuster) { return adjuster.id === id }));
    },

    findByUsername: function(username) {
        return _.clone(_.find(adjusters, function(adjuster) { return adjuster.username === username; }));
    },

    findByProviderId: function(provider, id) {
        return _.find(adjusters, function(adjuster) { return adjuster[provider] === id; });
    },

    serializeUser: function(adjuster, done) {
        done(null, adjuster.id);
    },

    deserializeUser: function(id, done) {
        var user = module.exports.findById(id);

        if(user)    { done(null, user); }
        else        { done(null, false); }
    }
};