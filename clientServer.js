"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var RiveScript = require("./lib/rivescript.js");
var app = express();
var fs = require('fs');
var path = require('path'); 
var core = require('./core/core')
var MongoClient = require('mongodb').MongoClient;
var urlConnection = "mongodb://localhost:27017/";
var dataBase="sofiachat"
var cluster = require('cluster');

var backsocket = require('socket.io-client')('http://localhost:4000');
backsocket.on('connect', function () {
  MongoClient.connect(urlConnection, function(err, db) {
    console.log('socket connect');


    // Create the bot.
    var dbo=db.db(dataBase)
    var bot = new RiveScript({ debug: false });
    bot.loadDirectory("./Brain", success_handler, error_handler);

    function success_handler(loadcount) {
      console.log("Load #" + loadcount + " completed!");

      bot.sortReplies();

      // Run server to listen on port 3000.
      var server = app.listen(3000, function () {
        console.log('listening on *:3000');
      });

      var io = require('socket.io')(server);
      app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });
      
      // Parse application/json inputs.
      app.use(bodyParser.json());
      app.use('/', express.static(__dirname + '/static'));
          
      app.post('/adminMsg', (req, res) => {
        console.log(req.body);
       var response = {};
        response.sofia = false;
        response.id = req.body.idUser;
        response.message = req.body.message;
        io.to(req.body.idUser).emit('response', response);
        res.send('Event received');
        
      });

      function recursiveRoutes(folderName) {
        fs.readdirSync(folderName).forEach(function(file) {

            var fullName = path.join(folderName, file);
            var stat = fs.lstatSync(fullName);

            if (stat.isDirectory()) {
                recursiveRoutes(fullName);
            } else if (file.toLowerCase().indexOf('.js')) {
                require('./' + fullName)(app,dbo);
                //console.log("Cargo modulo --> " + fullName );
            }
        });
      }

      recursiveRoutes('routes_client');



      io.sockets.on('connection', function (socket) {

        socket.on('message', function (data) {
          var response = {};
          // Get a reply from the bot.
          var message={
            id:socket.id ,
            name: data.name,
            email:data.email,
            date: new Date(),
            message:data.message,
            response:response.message,
            idConversation:data.idConversation
          }
          if(data.sofia){
              var aux = accents(data.message)
              var reply = bot.reply(socket.id, aux, this);
              if (reply === 'Unknown') {
                reply = 'Disculpa, no te he entendido.';
              }
              
              response.sofia = true;
              response.id = socket.id;
              response.message = reply;
              io.to(socket.id).emit('response', response);
              message.response=reply
              core.saveConversationWithSofia(dbo,message)

          }
          core.saveConversation(dbo,message)

          
          backsocket.emit('message',message)
        })
        socket.on('disconnect', function() {
          console.log('disconnect ',socket.id)
          core.deleteUser(dbo,socket.id)
          backsocket.emit('desconectado',{id:socket.id})
        });
       

      });
    }
    function error_handler(loadcount, err) {
      console.log("Error loading batch #" + loadcount + ": " + err + "\n");
    }

    function accents(text) {
      var dict = { "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "Á": "a", "É": "e", "Í": "i", "Ó": "o", "Ú": "u", "?": " ", "¿": " ", ".": " ", ",": " ", ";": " ", ":": " ", "\\": " ", "\"": " ", "$": " monto ", }

      text = text.replace(/[^\w ]/g, function (char) {
        var val = dict[char] || char;
        return val;
      });
      return text;
    }

  })
});

