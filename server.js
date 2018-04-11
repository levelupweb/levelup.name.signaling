require("dotenv").config();

const http = require("http");
// const url = require("url");
// const path = require("path");
// const fs = require("fs");
// const uuid = require('node-uuid');
const cors = require("cors");
const signaling = require("./signaling");

const express = require('express');
const app = express();
const server = http.createServer(app);

app.use(cors);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(process.env.PORT, () => {
  console.log('Example app listening on port: ', process.env.PORT);
});

// io.sockets.on('connection', (socket) => {
//     console.log("connected");
//     socket.on('message', (data) => {
//         const fileName = uuid.v4();
        
//         socket.emit('ffmpeg-output', 0);

//         writeToDisk(data.audio.dataURL, fileName + '.wav');

//         if (data.video) {
//             writeToDisk(data.video.dataURL, fileName + '.webm');
//             merge(socket, fileName);
//         }

//         else socket.emit('merged', fileName + '.wav');
//     });
// });

// const writeToDisk = (dataURL, fileName) => {
//   const fileExtension = fileName.split('.').pop();
//   const fileRootNameWithBase = `./uploads/${fileName}`;
//   let filePath = fileRootNameWithBase;
//   let fileID = 2;
//   let fileBuffer;

//   while (fs.existsSync(filePath)) {
//     filePath = fileRootNameWithBase + '(' + fileID + ').' + fileExtension;
//     fileID += 1;
//   }

//   dataURL = dataURL.split(',').pop();
//   fileBuffer = new Buffer(dataURL, 'base64');
//   fs.writeFileSync(filePath, fileBuffer);
// }

// const merge = (socket, fileName) => {
//     const FFmpeg = require('fluent-ffmpeg');

//     const audioFile = path.join(__dirname, 'uploads', fileName + '.wav');
//     const videoFile = path.join(__dirname, 'uploads', fileName + '.webm');
//     const mergedFile = path.join(__dirname, 'uploads', fileName + '-merged.webm');

//     new FFmpeg({
//       source: videoFile
//     })
//       .addInput(audioFile)
//       .on('error', function (err) {
//           socket.emit('ffmpeg-error', 'ffmpeg : An error occurred: ' + err.message);
//       })
//       .on('progress', function (progress) {
//           socket.emit('ffmpeg-output', Math.round(progress.percent));
//       })
//       .on('end', function () {
//           socket.emit('merged', fileName + '-merged.webm');
//           console.log('Merging finished !');

//           fs.unlink(audioFile);
//           fs.unlink(videoFile);
//       })
//       .saveToFile(mergedFile);
// }

signaling(server, (socket) => {
  try {
      const params = socket.handshake.query;

      // "socket" object is totally in your own hands!
      // do whatever you want!

      // in your HTML page, you can access socket as following:
      // connection.socketCustomEvent = 'custom-message';
      // var socket = connection.getSocket();
      // socket.emit(connection.socketCustomEvent, { test: true });

      if (!params.socketCustomEvent) {
          params.socketCustomEvent = 'custom-message';
      }

      socket.on(params.socketCustomEvent, (message) => {
          try {
              socket.broadcast.emit(params.socketCustomEvent, message);
          } catch (e) {}
      });
  } catch (e) {}
});