var express = require('express');
var app = express();
var roman = require('roman-encryption.js');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/encrypt', function(req, res) {
  var data = {
    number: req.body.number,
    threshhold: req.body.threshhold,
    length: 10 // Default length of returned array
  };
  if (req.body.length) data.length = req.body.length;
  var ret;
  if ((ret = encrypt(data.number, data.threshhold, data.length))) {
    res.send(ret);
  } else {
    res.send('error has occured in encryption');
  }
});

app.get('/decrypt', function(req, res) {

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
