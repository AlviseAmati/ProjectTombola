const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const PORT = 4000;
const socketIO = require("socket.io")(http, {
	cors: {
		origin: "http://localhost:19006",
	},
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const generateID = () => Math.random().toString(36).substring(2, 10);
let chatRooms = [];

function creaArrayDaEstrarre(){
    var temp = []
    for(var i = 1; i <= 90; i++){
        temp.push(i)
    }
    return temp
}

socketIO.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on("createRoom", (name) => {
		chatRooms.unshift({ id: generateID(), name, numeriEstratti:[], numeriDaEstrarre: creaArrayDaEstrarre()});
		socket.emit("roomsList", chatRooms);
	});

	socket.on("enterRoom", (obj) => {
		let result = chatRooms.filter((room) => room.id == obj.id);
        socket.join(result[0].name);
        socket.join(result[0].id)
        socketIO.to(result[0].id).emit("utenteCollegato",obj.username)
        console.log(result)
		// console.log(chatRooms);
		socket.emit("roomEntered", result[0].id);
		// console.log("Messages Form", result[0].messages);
	});

	socket.on("disconnect", () => {
		socket.disconnect();
		console.log("🔥: A user disconnected");
	});

    socket.on("gameStart", (id) => {
        console.log(id)
		let result = chatRooms.filter((room) => room.id == id);
        console.log(result)
        setInterval(() => {estraiNumero(socket,result[0].numeriDaEstrarre, result[0].numeriEstratti,result[0].id)}, 5000)
    })
});

function estraiNumero(socket,numeriDaEstrarre,numeriEstratti,id){
    const random = Math.floor(Math.random() * numeriDaEstrarre.length);
    var numeroEstratto = numeriDaEstrarre[random]
    numeriEstratti.push(numeroEstratto)
    socketIO.to(id).emit("numeroEstratto",numeriDaEstrarre[random])
    numeriDaEstrarre.splice(random - 1, 1);
    console.log(numeriEstratti.length)
    console.log(numeriDaEstrarre.length)
}

app.get("/api", (req, res) => {
    console.log("Richiedo stanze")
	res.json(chatRooms);
});

http.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
