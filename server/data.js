const express = require("express");
const fs = require("fs");

const router = express.Router();

router.get("", (req, res, next) => {
    fs.readFile("assets/caches/entries.txt", "utf8", (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        var re = new RegExp(";(.*);", "g");
        var entries = data.match(re);
        
        entries.forEach((word, index, arr) => {
            w = word.substring(1, word.length - 1);
            arr[index] = w;
        });

        // for (var s of entries) {
        //     console.log(s);
        // }
        // console.log(entries.length);

        res.status(200).json({
            entries: entries
        });
    });
});

module.exports = router;
