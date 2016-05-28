var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
//var roman = require('roman-encryption.js');

function encrypt(number, threshhold, length) {
  return {message:'You entered number = ' + number + ' threshhold = ' + threshhold + ' length = ' + length};
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/encrypt', upload.array(), function (req, res, next) {
  var number = 'nothing';
  try {
    if (req.body.number) number = req.body.number;
  } catch (e) {
    console.log('Error in parsing.');
    req.send({message: 'Error in parsing.'});
  }
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

});

app.listen(3000, '2602:306:cdad:b220:195a:4b19:bd61:55b7', function () {
  console.log('Example app listening on port 3000!');
});
