Angular-Passport-Auth-SIO
=========================
This is a fork from the following
https://github.com/fnakstad/angular-client-side-auth
https://github.com/jfromaniello/passport.socketio
with  major league help from Michael Robinson at faceleg
This is a major demonstration  of express.io,  passport, passport.socketio, firebird sql and angular.
I've included all the code for those it might help.
Notes:
1) Firebird is an open source sql database see (firebird.org , ibphoeninx.com) and can easily be replace by mysql.
2) I use the database for local authentication
3) socket.js uses the authenication credentials to bring only the data for logged in user. See 
    socket.on('getclaims', function (data) {
        var user = socket.handshake.session;//.user_id;
        var adj = user.req.session.req.user.adjusterid;
        console.log('== get only open claims for authenticated useer ', adj)
        qrystr = 'select CLAIM_ID "id", CLAIM_NO "title" , INSURED_ID, CLAIM_TYPE "type", ADJUSTER_ID, ACCOUNT_REP_ID "reporter" , INSURANCE_COMPANY_ID "assignee"  , \
            description,status "status",   DATE_OF_LOSS, POLICY_NUMBER,REPORTED,RECOVERY_COMMENTS,RECEIVED from CLAIM where ADJUSTER_ID= ? and status = 1 ';
        console.log('qrystr: ', qrystr, [adj ]);
        console.log('==============================================================');
        database.execute(qrystr, [adj], function (err, results, fields) {
            var jsondata = new Array();
            wrapJson(results, fields, jsondata);
            output = {"Claims": jsondata};
            socket.emit('initclaims', output);
        });

    });
4)I will refactor this code asap to make it more efficient
Thanks to all who helped.
John

