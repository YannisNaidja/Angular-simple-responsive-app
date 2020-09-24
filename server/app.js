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
const { currentId } = require('async_hooks');
const app = express();
const NodeCache = require( "node-cache" );
const myCache = new NodeCache({stdTTL: 100, checkperiod: 120});
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

// les types de noeuds (Nodes Types) : nt;ntid;'ntname'
// les noeuds/termes (Entries) : e;eid;'name';type;w;'formated name' 
// les relations sortantes : r;rid;node1;node2;type;w 
// les relations entrantes : r;rid;node1;node2;type;w 

app.get("/getRelationType/:word", cors(corsOptions), (req, res) => {

    //check si dans le cache
    

    // avoir les types de relations associees à un mot

    let word = req.params.word;

    console.log(word);

    var id_key= word+"_getRelationType";

    if(myCache.has(id_key)){
        CachedData = myCache.get(id_key);
        res.end(JSON.stringify(CachedData));
    }
    else{

      http.get("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
        word + "&rel=36?gotermsubmit=Chercher&gotermrel=" + word +
        "&rel=", (resp) => {
          resp.setEncoding('binary');
          let data = '';
          resp.on('data', (chunk) => {
            data += chunk;
          });
          resp.on('end', () => {
            const regex = /(rt;[0-9]+;.*)/gm;
        console.log(data.match(regex));
        var relationstypes = data.match(regex);
        var RelationsTypesArray = new Array();
        for(var s of relationstypes){
            //console.log(s);
            var relationtype = {
              id    :s.split(";")[1],
              desc  :s.split(";")[3],
              tips   :s.split(";")[5],
              clicked : false     
          };
            var rez = s.split(";")[1]+" "+s.split(";")[3];
            console.log(rez);
            RelationsTypesArray.push(relationtype);
        }

        myCache.set(id_key,RelationsTypesArray,3600);
        res.end(JSON.stringify(RelationsTypesArray));
      });
    });
  }
});


    
   /* request("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
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
        var relationstypes = body.match(regex);
        var RelationsTypesArray = new Array();
        for(var s of relationstypes){
            //console.log(s);
            var relationtype = {
              id    :s.split(";")[1],
              desc  :s.split(";")[3],
              tips   :s.split(";")[5]          
          };
            var rez = s.split(";")[1]+" "+s.split(";")[3];
            console.log(rez);
            RelationsTypesArray.push(relationtype);
        }

       
        res.end(JSON.stringify(RelationsTypesArray));
    });*/
    

app.get("/getRelations/:word/", cors(corsOptions), (req, res) => {

  // avoir toutes les relations entrantes ou sortantes associées à ce mot 

  let word= req.params.word;

  var id_key= word+"_getRelations";

    if(myCache.has(id_key)){
        CachedData = myCache.get(id_key);
        res.end(JSON.stringify(CachedData));
    }
    else{

      http.get("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
      word + "&rel=36?gotermsubmit=Chercher&gotermrel=" + word +
      "&rel=", (resp) => {
        resp.setEncoding('binary');
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          const regex = /(r;[0-9]+;.*)/gm;
          console.log(data.match(regex));
          var nodes = data.match(regex);
          var nodesArray = new Array();
        for(var s of nodes){
       
          var node = {
            idSource : s.split(";")[2],
            idTarget : s.split(";")[3],
            idRelationType : s.split(";")[4],
            poidRelation : s.split(";")[5],
            }
            
          nodesArray.push(node);
        } 

        myCache.set(id_key,nodesArray,3600);
        res.end(JSON.stringify(nodesArray));
    });
  });

      

  /*request("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
    word + "&rel=?gotermsubmit=Chercher&gotermrel=" + word +
    "&rel=", {
      json: true
    }, (err, res2, body) => {
      if (err) {
        return console.log(err);
      }
     // const regex = /((e;[0-9]+;.*)|(r;[0-9]+;.*))/m;
      const regex = /(r;[0-9]+;.*)/gm;
      console.log(body.match(regex));
      var nodes = body.match(regex);
      var nodesArray = new Array();
      for(var s of nodes){
       
          var node = {
            idSource : s.split(";")[2],
            idTarget : s.split(";")[3],
            idRelationType : s.split(";")[4],
            poidRelation : s.split(";")[5]
            }
            
          nodesArray.push(node);
        } 

        myCache.set(id_key,nodesArray,3600);
        res.end(JSON.stringify(nodesArray));
        });*/
    }
});

app.get("/getAssociatedNodes/:word/", cors(corsOptions), (req, res) => {

  // avoir les infos de tous les noeuds associés à un mot.


  let word = req.params.word;

  var id_key= word+"_getAssociatedNodes";

  

    if(myCache.has(id_key)){
    console.log("try cache");
    CachedData = myCache.get(id_key);
    res.end(JSON.stringify(CachedData));
    }else{

      http.get("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
      word + "&rel=36?gotermsubmit=Chercher&gotermrel=" + word +
      "&rel=", (resp) => {
        resp.setEncoding('binary');
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          const regex = /(e;[0-9]+;.*)/gm;
          console.log(data.match(regex));
          var nodes = data.match(regex);
          var nodesArray = new Array();
          for(var s of nodes){
           
              var node = {
                id : s.split(";")[1],
                name : s.split(";")[2]
                }
    
              nodesArray.push(node);
            } 
        
            myCache.set(id_key,nodesArray,3600); // dans le cache pour une heure
            res.end(JSON.stringify(nodesArray));
    });
  });


  
  /*request("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
    word + "&rel=?gotermsubmit=Chercher&gotermrel=" + word +
    "&rel=", {
      json: true
    }, (err, res2, body) => {
      if (err) {
        return console.log(err);
      }
     // const regex = /((e;[0-9]+;.*)|(r;[0-9]+;.*))/m;
      const regex = /(e;[0-9]+;.*)/gm;
      console.log(body.match(regex));
      var nodes = body.match(regex);
      var nodesArray = new Array();
      for(var s of nodes){
       
          var node = {
            id : s.split(";")[1],
            name : s.split(";")[2]
            }

          nodesArray.push(node);
        } 
    
        myCache.set(id_key,nodesArray,3600); // dans le cache pour une heure
        res.end(JSON.stringify(nodesArray));
        });*/
    }
});


app.get("/getAssociatedNodeById/:word/:id", cors(corsOptions), (req, res) => {

  // avoir les infos d'un noeud grâce à son id

  let word= req.params.word;
  let id = req.params.id;

  http.get("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
      word + "&rel=36?gotermsubmit=Chercher&gotermrel=" + word +
      "&rel=", (resp) => {
        resp.setEncoding('binary');
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          //const regex = /(r;[0-9]+;.*)/gm;
          const regex = /(e;[0-9]+;.*)/gm;
          console.log(data.match(regex));
          var nodes = data.match(regex);
          
          for(var s of nodes){
            let currentid = s.split(";")[1];
            if(currentid===id){
              var node = {
                id : currentid,
                name : s.split(";")[2]
                }
              res.end(JSON.stringify(node));
            } 
          }
          res.end(JSON.stringify("Pas de noeud associe a ce mot pour cet id."));
        });
      });


  /*request("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
    word + "&rel=?gotermsubmit=Chercher&gotermrel=" + word +
    "&rel=", {
      json: true
    }, (err, res2, body) => {
      if (err) {
        return console.log(err);
      }
     // const regex = /((e;[0-9]+;.*)|(r;[0-9]+;.*))/m;
      const regex = /(e;[0-9]+;.*)/gm;
      console.log(body.match(regex));
      var nodes = body.match(regex);
      
      for(var s of nodes){
        let currentid = s.split(";")[1];
        if(currentid===id){
          var node = {
            id : currentid,
            name : s.split(";")[2]
            }
          res.end(JSON.stringify(node));
        } 
      }
      res.end(JSON.stringify("Pas de noeud associe a ce mot pour cet id."));
  });*/
});

app.get("/getAssociatedRelationsById/:word/:id", cors(corsOptions), (req, res) => {

  // avoir les relations d'un mot par l'id de le relation

  let word= req.params.word;
  let id = req.params.id;

  var id_key=word+"_"+id+"_getAssociatedRelationsById";

  if(myCache.has(id_key)){
    CachedData = myCache.get(id_key);
    res.end(JSON.stringify(CachedData));
    }else{

      http.get("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
      word + "&rel=36?gotermsubmit=Chercher&gotermrel=" + word +
      "&rel=", (resp) => {
        resp.setEncoding('binary');
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          const regex = /(r;[0-9]+;.*)/gm;
            console.log(data.match(regex));
            var nodes = data.match(regex);
            var nodesArray = new Array();
          for(var s of nodes){
              if(s.split(";")[4]===id){
              var node = {
                idSource : s.split(";")[2],
                idTarget : s.split(";")[3],
                idRelationType : s.split(";")[4],
                poidRelation : s.split(";")[5]
                }
                nodesArray.push(node);
              } 
            }
              myCache.set(id_key,nodesArray,3600);
              res.end(JSON.stringify(nodesArray));
        });
      });
    }
  });

          
        

  


      

  /*request("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
    word + "&rel=?gotermsubmit=Chercher&gotermrel=" + word +
    "&rel=", {
      json: true
    }, (err, res2, body) => {
      if (err) {
        return console.log(err);
      }
     // const regex = /((e;[0-9]+;.*)|(r;[0-9]+;.*))/m;
      const regex = /(r;[0-9]+;.*)/gm;
      console.log(body.match(regex));
      var nodes = body.match(regex);
      var nodesArray = new Array();
      for(var s of nodes){
        let currentid = s.split(";")[4];
        if(currentid===id){
          var node = {
            idSource : s.split(";")[2],
            idTarget : s.split(";")[3],
            idRelationType : s.split(";")[4],
            poidRelation : s.split(";")[5]
            }
            nodesArray.push(node);
        } 
      }
      myCache.set(id_key,nodesArray,3600);
      res.end(JSON.stringify(nodesArray));
        });*/
      
app.get("/getWordId/:word", cors(corsOptions), (req, res) => {

        let word= req.params.word;
        quotedword = "'"+word+"'";

        http.get("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
      word + "&rel=36?gotermsubmit=Chercher&gotermrel=" + word +
      "&rel=", (resp) => {
        resp.setEncoding('binary');
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          const regex = /(e;[0-9]+;.*)/gm;
          console.log(data.match(regex));
          var nodes = data.match(regex);
          for(var s of nodes){
            console.log("comparaison de "+s.split(";")[2]+" avec "+ word);
            if(s.split(";")[2]===   quotedword){
              res.end(JSON.stringify(s.split(";")[1]));
            } 
          }
          res.end(JSON.stringify("id du mot non trouvee"));
        });
    });

    });