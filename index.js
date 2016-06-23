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

var defaultArraySize = 50;

var format = 'Correct usage of encrypt: \n{number:*number to be encrypted, ' +
  'threshold:*threshold to be used in encryption, size:*desired length of returned array (default is ' + defaultArraySize + ')}\n' +
  'Correct usage of decrypt: \n{array:*encrypted array to decrypt, threshold:*threshold that was used in encryption}';

/**
  Basic error handler taken from Heroku tutorial.
**/
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/* These "middleware" allow access to parameters passed in post requests. */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.get('/', function (req, res) {
  res.render(__dirname + '/index.html');
});

// I don't entirely understand why upload.array() is necessary, but it is from multer
app.post('/encrypt', upload.array(), function (req, res, next) {
  var number = 'nothing';
  var threshold = 'nothing';
  var size = 'nothing';

  if (!req.body.number || !req.body.threshold) {
    handleError(res, 'Missing parameters.', 'Missing parameters.\n' + format, 400)
  }

  /**
    Second parameter in parseInt is the base you want to parse. Always specify this,
    because if the number starts with a '0' it is possible for it to be parsed in
    base-8.
  */
  if (number = parseInt(req.body.number, 10) === 'NaN') {
    handleError(res, 'Number is invalid.', 'Number is invalid. Please use correct base-10 representation.', 400);
  }

  if ((threshold = parseInt(req.body.threshold, 10)) === 'NaN') {
    handleError(res, 'Threshold is invalid.', 'Threshold is invalid. Please use correct base-10 representation.', 400);
  }

  if (req.body.size) {
    if ((size = parseInt(req.body.size, 10)) === 'NaN') {
      handleError(res, 'Size is Invalid.', 'Size is invalid. Please use correct base-10 representation.', 400);
    }
  } else size = defaultArraySize;

  if (size < 3) {
    handleError(res, 'Size is too small.', 'Size too small. Please use a value greater than or equal to 3.', 400);
  }

  var array;
  array = roman.encrypt(number, threshold, size);

  res.send({message:('Encrypted with number = ' + number + ' threshhold = ' +
  threshhold + ' size = ' + size + '.'), encryptedNumber:array});
});

app.post('/decrypt', upload.array(), function (req, res, next) {
  var array, threshhold;

  if (!req.body.array || !req.body.threshold) {
    handleError(res, 'array or threshold is missing.', 'array and threshold are required.\n' + format, 400);
  }

  try {
    array = JSON.parse(req.body.array);
  } catch (e) {
    if (e instanceof SyntaxError) {
      handleError(res, 'array was formatted incorrectly.', 'array was in invalid format. Make sure there is no trailing comma.', 400);
    } else {
      handleError(res, 'Unknown error occurred.', 'Unknown error occurred. Contact author for support.', 500);
    }
  }

  if ((threshold = parseInt(req.body.threshold)) === 'NaN') {
    handleError(res, 'threshold invalid format.', '')
  }

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
