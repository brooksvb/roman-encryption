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
  var threshhold = 'nothing';
  var size = 'nothing';

  if (req.body.number) number = req.body.number;
  else res.send({message:'ERROR: You must supply a number.'})

  if (req.body.threshhold) threshhold = req.body.threshhold;
  else threshhold = 0;

  if (req.body.size) size = req.body.size;
  else size = 50;

  var array;
  array = roman.encrypt(number, threshhold, size);


  res.send({message:('Encrypted with number = ' + number + ' threshhold = ' +
  threshhold + ' size = ' + size + '.'), encrypt:array});
});

app.post('/decrypt', upload.array(), function (req, res, next) {
  if (req.body) console.log('Received at decrypt hook: ' + JSON.stringify(req.body));
  else console.log('Parsing error at decrypt hook.');

  var array, threshhold;

  if (req.body.array) array = JSON.parse(req.body.array);
  else req.send({message:'Missing array.'});

  if (req.body.threshhold) threshhold = req.body.threshhold;
  else req.send({message:'Can\'t decrypt without threshhold.'});

  number = roman.decrypt(array, threshhold);

  res.send({message:'Successfully decrypted.',number:this.number});
});

app.post('/test', upload.array(), function(req, res, next) {
  roman.test();
});

// I specify my ipv6 address, otherwise it defaults to listening on my ipv4 address (???)
// TEMPORARILY REMOVED IPv6 FOR TESTING ON LOCALHOST
// TODO: is there a way to check my ipv6 address automatically? Instead of updating it myself when it changes?
app.listen(3000,  function () {
  console.log('Example app listening on port 3000!');
});
