/*
 * Serve content over a socket
 */

module.exports = function (socket) {
    //   console.log(socket.name3)

    socket.emit('send:name', {
        name: 'Bob'
    });
    socket.emit('send:name3', {

        name3: 'Bob3'

    });

    setInterval(function () {
        socket.emit('send:time', {
            time: (new Date()).toString()
        });
    }, 1000);
};
