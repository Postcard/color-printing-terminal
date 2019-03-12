var KeyboardCharacters = require('node-hid-stream').Keyboard;
var characters = new KeyboardCharacters({ vendorId: 0x0a81, productId: 0x0205 });
var figure = require('figure-sdk')({token: process.env.TOKEN});
var printerQueue = require('./printerQueue');
var Buffer = require('./codeBuffer');
var toAzerty = require('./azertyKeyMap');

var code = new Buffer({
  onSubmitCode: function(str){
    console.log('New code submitted: ', str);

    figure.portraits.get(str, function(error, portrait){
      if(error) {
        console.log("Error: ", error)
      } else {
        printerQueue.push({
          portrait: portrait
        });
      }
    });
  }
})

characters.on("data", function(data) {
  let letters = data.charCodes.filter(l => l);
  if(letters.length === 1) {
    return code.push(toAzerty(letters[0].toUpperCase()));
  }

  if(data.keyCodes.includes(40 /* enter */) ||
    data.keyCodes.includes(41 /* escape */)
  ) {
    return code.reset();
  }
  if(data.keyCodes.includes(42 /* delete */)) {
    return code.delete();
  }
});
