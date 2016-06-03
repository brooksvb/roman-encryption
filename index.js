var express = require('express');
var app = express();
var roman = require('./roman-encryption');

/* Middleware for parsing post request body */
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

var ip = require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: ' + add);
});

function encrypt(number, threshhold, length) {
  return {message:'You entered number = ' + number + ' threshhold = ' + threshhold + ' length = ' + length};
}

/* These "middleware" allow access to parameters passed in post requests. */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.get('/', function (req, res) {
  res.send('Root page');
});

// I don't entirely understand why upload.array() is necessary, but it is from multer
app.post('/encrypt', upload.array(), function (req, res, next) {
  var number = 'nothing';
  // try {
    if (req.body.number) number = req.body.number;
  // } catch (e) {
  //   console.log('Error in parsing.');
  //   req.send({message: 'Error in parsing.'});
  // }
  res.send({message:'You entered number =' + number, butt: 'hole'});
  // var data = {
  //   number: req.body.number,
  //   threshhold: req.body.threshhold,
  //   length: 10 // Default length of returned array
  // };
  // if (req.body.length) data.length = req.body.length;
  // var ret;
  // if ((ret = encrypt(data.number, data.threshhold, data.length))) {
  //   res.send(ret);
  // } else {
  //   res.send('error has occured in encryption');
  // }
});

app.post('/decrypt', function (req, res) {
  if (req.body) console.log('Received at decrypt hook:' + req.body);
  else console.log('Parsing error at decrypt hook.');

});

// I specify my ipv6 address, otherwise it defaults to listening on my ipv4 address (???)
// TEMPORARILY REMOVED IPv6 FOR TESTING ON LOCALHOST
// TODO: is there a way to check my ipv6 address automatically? Instead of updating it myself when it changes?
app.listen(3000,  function () {
  console.log('Example app listening on port 3000!');
});
