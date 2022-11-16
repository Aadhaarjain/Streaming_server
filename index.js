var express = require('express');
var app = express();
var fs = require('fs');

app.get('/', function(req, res){
    res.sendFile(__dirname+ "/index.html");
})


app.get('/video', function(req, res){
    
    var range = req.headers.range;
    if(!range){
        res.status(400).send("Requires Range header");
    }
    var videoPath = "./video/tom&jerry.mp4";
    var videoSize = fs.statSync(videoPath).size;
    //console.log("size of video is:", videoSize);
    var CHUNK_SIZE = 10**6; //1 MB
    var start = Number(range.replace(/\D/g, "")); 
    var end = Math.min(start + CHUNK_SIZE , videoSize-1);
    var contentLength = end-start+1;
    var headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": 'bytes',
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }
    res.writeHead(206,headers);
    var videoStream = fs.createReadStream(videoPath,{start, end});
    videoStream.pipe(res);

})

app.listen(3000, function(){
    console.log("Server is running on port:", 3000);
});
