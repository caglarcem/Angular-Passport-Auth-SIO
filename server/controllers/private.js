var _ =           require('underscore')
    , Adjuster =      require('../models/Adjuster.js')


module.exports = {
    index: function(req, res) {
        var adjusters = Adjuster.findAll();
//        _.each(users, function(user) {
//            delete user.password;
//            delete user.twitter;
//            delete user.facebook;
//            delete user.google;
//        });
        res.json(adjusters);
        console.log(" /server/controllers/private.js ",adjusters)
    }
};