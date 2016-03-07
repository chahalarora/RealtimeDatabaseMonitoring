var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs'),
    mysql = require('mysql'),
    connectionsArray = [],
    connection = mysql.createConnection({
        host: 'localhost',     //Database username
        user: 'root',          //Database username
        password: 'Hello123',  //Database password
        database: 'socketTest', //Database name
        port: 3306
    }),
    POLLING_INTERVAL = 3000,
    pollingTimer;

// If there is an error connecting to the database
connection.connect(function(err) {
    // connected! (unless `err` is set)
    if (err) {
        console.log(err);
    }
});

// creating the server ( localhost:8000 )
app.listen(8000);

// on server started we can load our client.html page
function handler(req, res) {
    fs.readFile(__dirname + '/client.html', function(err, data) {
        if (err) {
            console.log(err);
            res.writeHead(500);
            return res.end('Error loading client.html');
        }
        res.writeHead(200);
        res.end(data);
    });
}

var pollingLoop = function() {

    // Doing the database query
    var query = connection.query('SELECT * FROM users'),
        users = []; // this array will contain the result of our db query

    // setting the query listeners
    query
        .on('error', function(err) {
            // Handle error, and 'end' event will be emitted after this as well
            console.log(err);
            updateSockets(err);
        })
        .on('result', function(user) {
            // it fills our array looping on each user row inside the db
            users.push(user);
        })
        .on('end', function() {
            // loop on itself only if there are sockets still connected
            if (connectionsArray.length) {

                pollingTimer = setTimeout(pollingLoop, POLLING_INTERVAL);

                updateSockets({
                    users: users
                });
            } else {

                console.log('The server timer was stopped because there are no more socket connections on the app')

            }
        });
};


var getUsersData = function() {

    // Doing the database query
    var query = connection.query('SELECT * FROM users'),
        users = []; // this array will contain the result of our db query

    // setting the query listeners
    query
        .on('error', function(err) {
            // Handle error, and 'end' event will be emitted after this as well
            console.log(err);
            sendUsersData(err);
        })
        .on('result', function(user) {
            // it fills our array looping on each user row inside the db
            users.push(user);
        })
        .on('end', function() {
            // loop on itself only if there are sockets still connected

            sendUsersData({
                users: users
            });
        });
};

var updateSockets = function(data) {
    // sending new data to all the sockets connected
    connectionsArray.forEach(function(tmpSocket) {
        tmpSocket.volatile.emit('notification', data);
    });
};
var sendUsersData = function(data) {
    connectionsArray.forEach(function(tmpSocket) {
        tmpSocket.emit('ehlo', data);
    });
};

// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on('connection', function(socket) {

    console.log('Number of connections:' + connectionsArray.length);
    // starting the loop only if at least there is one user connected

    if (!connectionsArray.length) {
        getUsersData()
        pollingLoop();
    }

    socket.on('disconnect', function() {
        var socketIndex = connectionsArray.indexOf(socket);
        console.log('socketID = %s got disconnected', socketIndex);
        if (~socketIndex) {
            connectionsArray.splice(socketIndex, 1);
        }
    });

    console.log('A new socket is connected!');
    connectionsArray.push(socket);

});