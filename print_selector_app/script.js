var KeyboardCharacters = require('node-hid-stream').KeyboardCharacters;
var characters = new KeyboardCharacters({ vendorId: 0x0a81, productId: 0x0205 });
var Figure = require('figure-sdk');
var printerQueue = require('./printerQueue')
var Buffer = require('./codeBuffer')

let figure = Figure({
  host: process.env.API_HOST,
  protocol: 'https',
  token: process.env.token
});

console.log(figure.portraits.get("ZZZZZ"))

var code = new Buffer({
  onSubmitCode: function(str){
    console.log('GOT IT BROOOOO', str);
    printerQueue.push({
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
    });
  }
})

characters.on("data", function(data) {
  console.log(data);

  if(data.length === 1){
    var char = data.charAt(0);
    if(/[a-zA-Z]/.test(char)) {
      code.push(data.toUpperCase());
    }
  }
});
