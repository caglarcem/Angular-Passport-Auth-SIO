Access [Passport.js](http://passportjs.org) user information from [socket.io](http://socket.io) connection using angular as client.
Angular-Passport-Auth-SIO
=========================
## This is a fork from the following

#### https://github.com/fnakstad/angular-client-side-auth

#### https://github.com/jfromaniello/passport.socketio

### Major League help from Michael Robinson at faceleg
### This is a complete demonstration  of express.io,  passport, passport.socketio, firebird sql and angular.
I've included all the code for those it might help.

## Blog
- http://johntomaselli.blogspot.com/2013/07/firebird-angularjs-node-and-socketio.html
- 
## Notes:
- To install in windows from command prompt
- md nodedemo
- cd nodedemo
- git clone https://github.com/johntom/Angular-Passport-Auth-SIO
- npm install
- node server
- install firebird and copy from adjuster.gdb from \database to wherever desired and change \Angular-Passport-Auth-SIO\server\models\cfg\cfg.json
- in browser http://localhost:8000

- [Firebird] (http://firebirdsql.org) (http://ibphoeninx.com) open source sql database and can easily be replaced by mysql.
- [https://github.com/hgourvest/node-firebird] Henri Gourvest essential repo for using node with firebird
- I use the database for local authentication (see \Server\Models\User.js)
- socket.js uses the authenication credentials to bring only the data for logged in user. See \Server\socket.js and  Usage
- I will refactor this code asap to make it more efficient

Usage 
=====
```javascript
    socket.on('getclaims', function (data) {
        var user = socket.handshake.session;//.user_id;
        var adj = user.req.session.req.user.adjusterid; // added to passport
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
...

Thanks to all who helped.


