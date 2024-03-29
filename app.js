const express = require('express');
var port = process.env.PORT || 8888;

const cors = require('cors');
const http = require('http');
const fs = require('fs');
const app = express();
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
app.use(express.json());

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// var distDir = __dirname + "/";
// app.use('/', express.static(distDir));

// origin: 'http://217.182.170.118:8888/',

var corsOptions = {
    origin: 'http://localhost:4200',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.options('*', cors());
app.listen(port);

// les types de noeuds (Nodes Types) : nt;ntid;'ntname'
// les noeuds/termes (Entries) : e;eid;'name';type;w;'formated name' 
// les relations sortantes : r;rid;node1;node2;type;w 
// les relations entrantes : r;rid;node1;node2;type;w 

/*
** LOADING ENTRIES
*/
console.log("LOADING entries...");
var entries = [];
console.log(process.cwd());
fs.readFile(process.cwd() + "/src/assets/entreejdm.txt", "utf8", (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    var re = new RegExp(";(\.*);", "g");
    entries = data.match(re);
    
    entries.forEach((word, index, arr) => {
        w = word.substring(1, word.length - 1);
        arr[index] = w;
    });

});
console.log("entries LOADED !");

app.get("/jdmentries", cors(corsOptions), (req, res) => {
    res.json(entries);
});

app.get("/getRelationType/:word", cors(corsOptions), (req, res) => {
    let word = escape(req.params.word);
    var id_key = word + "_getRelationType";

    if (myCache.has(id_key)) {
        CachedData = myCache.get(id_key);
        res.end(JSON.stringify(CachedData));
    }
    else {

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
                    var relationstypes = data.match(regex);
                    var RelationsTypesArray = new Array();
                    for (var s of relationstypes) {
                        var relationtype = {
                            id: s.split(";")[1],
                            desc: s.split(";")[3].replace(/'/g, ''),
                            tips: s.split(";")[5],
                            clicked: false
                        };
                        var rez = s.split(";")[1] + " " + s.split(";")[3];
                        RelationsTypesArray.push(relationtype);
                    }

                    myCache.set(id_key, RelationsTypesArray, 3600);
                    res.end(JSON.stringify(RelationsTypesArray));
                });
            });
    }
});

app.get("/getRelations/:word/", cors(corsOptions), (req, res) => {

    // avoir toutes les relations entrantes ou sortantes associées à ce mot 

    let word = escape(req.params.word);
    var id_key = word + "_getRelations";

    if (myCache.has(id_key)) {
        CachedData = myCache.get(id_key);
        res.end(JSON.stringify(CachedData));
    }
    else {

        http.get("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
            word + "&rel=?gotermsubmit=Chercher&gotermrel=" + word +
            "&rel=", (resp) => {
                resp.setEncoding('binary');
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    const regex = /(r;[0-9]+;.*)/gm;
                    var nodes = data.match(regex);
                    var nodesArray = new Array();
                    for (var s of nodes) {
                        var node = {
                            idSource: s.split(";")[2],
                            idTarget: s.split(";")[3],
                            idRelationType: s.split(";")[4],
                            poidRelation: s.split(";")[5],
                        }
                        nodesArray.push(node);
                    }
                    myCache.set(id_key, nodesArray, 3600);
                    res.end(JSON.stringify(nodesArray));
                });
            });
    }
});

app.get("/getAssociatedNodes/:word/", cors(corsOptions), (req, res) => {

    // avoir les infos de tous les noeuds associés à un mot.
    let word = escape(req.params.word);
    var id_key = word + "_getAssociatedNodes";

    if (myCache.has(id_key)) {
        CachedData = myCache.get(id_key);
        res.end(JSON.stringify(CachedData));
    } else {

        http.get("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
            word + "&rel=?gotermsubmit=Chercher&gotermrel=" + word +
            "&rel=", (resp) => {
                resp.setEncoding('binary');
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    const regex = /(e;[0-9]+;.*)/gm;
                    var nodes = data.match(regex);
                    var nodesArray = new Array();
                    for (var s of nodes) {
                        var node = {
                            id: s.split(";")[1],
                            name: s.split(";")[2].replace(/'/g, '')
                        }
                        nodesArray.push(node);
                    }
                    myCache.set(id_key, nodesArray, 3600); // dans le cache pour une heure
                    res.end(JSON.stringify(nodesArray));
                });
            });

    }
});

app.get("/getAssociatedNodeById/:word/:id", cors(corsOptions), (req, res) => {

    // avoir les infos d'un noeud grâce à son id
    let word = escape(req.params.word);
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
                var nodes = data.match(regex);

                for (var s of nodes) {
                    let currentid = s.split(";")[1];
                    if (currentid === id) {
                        var node = {
                            id: currentid,
                            name: s.split(";")[2]
                        }
                        res.end(JSON.stringify(node));
                    }
                }
                res.end(JSON.stringify("Pas de noeud associe a ce mot pour cet id."));
            });
        });
});

app.get("/getAssociatedRelationsById/:word/:id", cors(corsOptions), (req, res) => {

    // avoir les relations d'un mot par l'id de le relation

    let word = escape(req.params.word);
    let id = req.params.id;

    var id_key = word + "_" + id + "_getAssociatedRelationsById";

    if (myCache.has(id_key)) {
        CachedData = myCache.get(id_key);
        res.end(JSON.stringify(CachedData));
    } else {

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
                    var nodes = data.match(regex);
                    var nodesArray = new Array();
                    for (var s of nodes) {
                        if (s.split(";")[4] === id) {
                            var node = {
                                idSource: s.split(";")[2],
                                idTarget: s.split(";")[3],
                                idRelationType: s.split(";")[4],
                                poidRelation: s.split(";")[5]
                            }
                            nodesArray.push(node);
                        }
                    }
                    myCache.set(id_key, nodesArray, 3600);
                    res.end(JSON.stringify(nodesArray));
                });
            });
    }
});

app.get("/getWordId/:word", cors(corsOptions), (req, res) => {

    let word = req.params.word;
    let encodedword = word.replace(/ /g, "+")
    encodedword = escape(encodedword);


    quotedword = "'" + word + "'";
    quotedword = quotedword.replace(/\+/g, " ");


    http.get("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
        encodedword + "&rel=36?gotermsubmit=Chercher&gotermrel=" + encodedword +
        "&rel=", (resp) => {
            resp.setEncoding('binary');
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                const regex = /(e;[0-9]+;.*)/gm;
                var nodes = data.match(regex);
                if (nodes != null) {
                    var s = nodes[0];
                    if (s.split(";")[2] === quotedword) {
                        res.end(JSON.stringify(s.split(";")[1]));
                    }
                }

            });
        });

});

app.get("/getWordRel1/:word", cors(corsOptions), (req, res) => {
    let word = escape(req.params.word);
    quotedword = "'" + word + "'";
    quotedword = quotedword.replace(/\+/g, " ");
    var id_key = word + "_getWordRel1";

    if (myCache.has(id_key)) {
        CachedData = myCache.get(id_key);
        res.end(JSON.stringify(CachedData));
    } else {

        http.get("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
            word + "&rel=1?gotermsubmit=Chercher&gotermrel=" + word +
            "&rel=1", (resp) => {
                resp.setEncoding('binary');
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    const regex = /(e;[0-9]+;.*)/gm;
                    const regexrel = /(r;[0-9]+;.*)/gm;
                    var nodes = data.match(regex);

                    var raffArray = new Array();
                    for (var s of nodes) {
                        if (s.split(";")[2].includes(word + ">")) {
                            var node = {
                                raffid: s.split(";")[2].replace(/'/g, ''),
                                raffdesc: s.split(";")[5].replace(/'/g, '')
                            }
                            raffArray.push(node)
                        }

                    }
                    myCache.set(id_key, raffArray, 3600);
                    res.end(JSON.stringify(raffArray));
                });
            });
    }
});

app.get("/getDef/:word", cors(corsOptions), (req, res) => {

    let encodedword = escape(req.params.word);
    encodedword = encodedword.replace(/%20/g, " ");
    let word = req.params.word;
    quotedword = "'" + word + "'";
    quotedword = quotedword.replace(/\+/g, " ");
    var id_key = word + "_getDef";

    if (myCache.has(id_key)) {
        CachedData = myCache.get(id_key);
        res.end(JSON.stringify(CachedData));
    } else {

        http.get("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
            encodedword + "&rel=?gotermsubmit=Chercher&gotermrel=" + encodedword +
            "&rel=", (resp) => {
                resp.setEncoding('binary');
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {

                    const regexname = /(e;[0-9]+;.*)/gm;
                    const regex = /<def>(.|\n)*?<\/def>/;
                    //const regex = /(?:<def>)([\s\S]*)(?:<\/def>)/;
                    var content = data.match(regex);
                    var newcontent = content.toString().replace(/<def>/, '');
                    newcontent = newcontent.toString().replace(/<br\s\/>/gm, '');
                    newcontent = newcontent.toString().replace("</def>,", '');
                    var namecontent = data.match(regexname);
                    var name = namecontent[0];
                    //presence d'un texte pour la def du raffinement
                    if (name.split(";")[5] !== undefined) {
                        var node = {
                            id: name.split(";")[5].replace(/'/g, ''),
                            value: newcontent,
                            show: false
                        }
                    }
                    else {
                        var node = {
                            value: newcontent,
                            show: false
                        }

                    }


                    res.end(JSON.stringify(node));

                    //todo cache
                });
            });
    }
});
