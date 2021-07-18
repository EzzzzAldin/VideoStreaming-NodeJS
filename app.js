const express = require('express');
const fs = require('fs');


const app = express();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/video", (req, res) => {
    // Check Found Rang Header
    const range = req.headers.range;
    if( !range) {
        res.status(400).send("Requiers Range Header")
    }
    // Get Video
    const videoPath = "zoro.mp4";
    // know size video To know start ANd End Point
    const videoSize = fs.statSync("zoro.mp4").size;

    // Size Video Parse Range 1MB
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    // Check Point contant In Size Video If Bigger return In start Video
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    
    const contantLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contantLength,
        "Content-Type": "video/mp4"
    };
    // Talk Browser I Send Part Video
    res.writeHead(206, headers);
    // Create Video Stream
    const videostream = fs.createReadStream(videoPath, { start, end });

    videostream.pipe(res);
});

const PORT = 3000;

app.listen(PORT, () => console.log(`Server Work to Port ${PORT}`));