var _ =   require('underscore')
    , Adjuster =      require('../models/Adjuster.js')


module.exports = {
    index: function(req, res) {

        var adjusters = Adjuster.findAll();  // this uses cache loaded the first time
//        _.each(users, function(user) {
//            delete user.password;
//            delete user.twitter;
//            delete user.facebook;
//            delete user.google;
//        });
        res.json(adjusters);
        console.log("================== /server/controllers/private.js ",adjusters);
        console.log("==================");
    },

    indexAll: function(req, res) {
        console.log('======indexAll===============')
        var adjusters = Adjuster.findAllNoCache();  //
        res.json(adjusters);
        console.log("================== /server/controllers/private.js ",adjusters);
        console.log("==================");
    }

};