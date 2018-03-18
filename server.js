var express = require("express");
var app = express();

app.use(express.static(__dirname + '/build'));

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/html/index.html')
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});