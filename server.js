var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var KeyboardCharacters = require('node-hid-stream').KeyboardCharacters;
var characters = new KeyboardCharacters({ vendorId: 0x0a81, productId: 0x0205 });
var AWS = require('aws-sdk');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a client connected');

  characters.on("data", function(data) {
    socket.emit('data', data);
    console.log(data);
  });
});

var sqs = new AWS.SQS({
  region: process.env.AWS_SQS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

sqs.getQueueUrl({
  QueueName: "printer-queue-2-production"
}, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    var MessageBody = {
      portrait: {
        "code": "ZZZZZ",
        "picture_1280": "https://figure-production.s3.amazonaws.com/media/snapshots/67_20150711173246_GMS2Sny_Sm29maC_yO6IklSr.jpg",
        "place": {
            "id": 1,
            "name": "Point Éphémère",
            "slug": "point-ephemere",
            "google_places_id": "ChIJT78RxHVu5kcRZoDCLEKfs3M",
            "tz": "Europe/Paris",
            "color_portraits": false
        },
        "event": null,
        "taken_str": "01/01/2015 01:45"
      }
    };
    sqs.sendMessage({
      QueueUrl: data.QueueUrl,
      MessageBody: JSON.stringify(MessageBody)
    }, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Sent!", data)
      }
    });
  }
});

/*

http.listen(80, function(){
  console.log('listening on *:80');
});

*/
