var express = require("express");
var app = express();

app.use(express.static(__dirname + '/docs'));

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/dist/index.html')
});

app.get("/data.json", function(req, res) {
    res.sendfile(__dirname + '/data.json')
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});