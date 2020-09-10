const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const treetagger = require('treetagger');
const cors = require('cors');
const http = require('http');
const fs = require('fs');
const request = require('request');
var qs = require('querystring');
const shell = require('shelljs');
const app = express();
app.use(express.json());

var corsOptions = {
  origin: 'http://localhost:4200',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(express.urlencoded({
  extended: true
}));
app.options('*', cors());
app.listen(8888);



app.get("/getRelationType/:word", cors(corsOptions), (req, res) => {
    let word = req.params.word;

    console.log(word);
  

    request("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
      word + "&rel=?gotermsubmit=Chercher&gotermrel=" + word +
      "&rel=", {
        json: true
      }, (err, res2, body) => {
        if (err) {
          return console.log(err);
        }
       // const regex = /((e;[0-9]+;.*)|(r;[0-9]+;.*))/m;
       const regex = /(rt;[0-9]+;.*)/gm;
        console.log(body.match(regex));
        let senay = body.match(regex);
        for(var s of senay){
            //console.log(s);
            var rez = s.split(";")[1]+" "+s.split(";")[3];
            console.log(rez);
        }
            

        //console.log(senay);
        res.end(JSON.stringify(senay));
    });
});