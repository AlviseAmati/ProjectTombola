const express = require('express');
const WebSocket = require('ws');

const app = express();

// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new WebSocket.Server({ port: 8082}); //porta su cui gira server
/*
wsServer.on("connection", ws => {
  console.log("Nuovo client connesso");
      ws.on("message", data => {
          console.log(`Client ci ha mandato: ${data}`);
            ws.send(data.toUpperCase()); // server rimanda al client convertendo stringa maiiuscola
        });
      ws.on("close", () => {
        console.log("Client disconnesso");
      });
});
*/
wsServer.on('connection', socket => {                                //ad ogni refresh/connessione si esegue questa funzione se mi servono piu client che si connettono mi servono piu di questi
  socket.on('message', message => console.log(message));
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(3000);
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});

//component mount per react