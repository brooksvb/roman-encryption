var express = require('express');
var app = express();
var roman = require('./roman-encryption');

/* Middleware for parsing post request body */
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
   // configure stuff here
    app.use(express.static(__dirname + '/'));
} else {
    app.use(express.static(__dirname + '/'));
}

var ip = require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: ' + add);
});

function encrypt(number, threshold, length) {
  return {message:'You entered number = ' + number + ' threshold = ' + threshold + ' length = ' + length};
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
  var threshold = 'nothing';
  var size = 'nothing';

  if (req.body.number) number = parseInt(req.body.number);
  else res.send({message:'ERROR: You must supply a number.'})

  if (req.body.threshold) threshold = parseInt(req.body.threshold);good
  else threshold = 0;

  if (req.body.size) size = req.body.size;
  else size = 50;

  var array;
  array = roman.encrypt(number, threshold, size);


  res.send({message:('Encrypted with number = ' + number + ' threshold = ' +
  threshold + ' size = ' + size + '.'), encrypt:array});
});

app.post('/decrypt', upload.array(), function (req, res, next) {
  if (req.body) console.log('Received at decrypt hook: ' + JSON.stringify(req.body));
  else console.log('Parsing error at decrypt hook.');

  var array, threshold;

  if (req.body.array) array = JSON.parse(req.body.array);
  else res.send({message:'Missing array.'});

  if (req.body.threshold) threshold = req.body.threshold;
  else res.send({message:'Can\'t decrypt without threshold.'});

  number = roman.decrypt(array, threshold);

  res.send({message:'Successfully decrypted.',number:this.number});
});

// I specify my ipv6 address, otherwise it defaults to listening on my ipv4 address (???)
// TEMPORARILY REMOVED IPv6 FOR TESTING ON LOCALHOST
// TODO: is there a way to check my ipv6 address automatically? Instead of updating it myself when it changes?
// Heroku dynamically assigns a port numbner through the env variables. Use this,
// otherwise 5000 will be default when run locally
app.listen(process.env.PORT || 5000,  function () {
  console.log('Example app listening on port' + process.env.PORT || 5000 + '!');
});
