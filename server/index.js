const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const { io } = require("socket.io-client");
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
		chatRooms.unshift({ id: generateID(), giocatori: [], name, numeriEstratti:[], numeriDaEstrarre: creaArrayDaEstrarre()});
		socket.emit("roomsList", chatRooms);
	});
    
    socket.on("exitRoom", (obj) => {
        console.log("Esco dalla stanza")
        for(var i = 0; i < chatRooms.length; i++){
            for(var j = 0; j < chatRooms[i].giocatori; j++){
                if(chatRooms[i].giocatori[j].socket == socket.id){
                    chatRooms[i].giocatori = myArray.splice(j, 1);
                    console.log("Un giocatore è uscito dalla stanza")
                }
            }
        }
    })

	socket.on("enterRoom", (obj) => {
		/*let result = chatRooms.filter((room) => room.id == obj.id);*/
        console.log("Entro nella lobby")
        console.log(obj)
        for(var i = 0; i < chatRooms.length; i++){
            if(chatRooms[i].id == obj.id){
                chatRooms[i].giocatori.push({
                    socket: socket.id,
                    username: obj.username
                })

                var res = []
                for(var room of chatRooms[i].giocatori){
                    res.push(room.username)
                }
                socket.join(chatRooms[i].id)
                socketIO.to(chatRooms[i].id).emit("listaUtenti",res)
                socket.emit("roomEntered", chatRooms[i].id);
            }
        }
        /*socket.join(result[0].name);
        socket.join(result[0].id)
        
        socketIO.to(result[0].id).emit("listaUtenti",obj.username)
        console.log(result)
		// console.log(chatRooms);
		socket.emit("roomEntered", result[0].id);
		// console.log("Messages Form", result[0].messages);*/
	});

	socket.on("disconnect", () => {
		socket.disconnect();
		console.log("🔥: A user disconnected");
	});

    socket.on("gameStart", (id) => {
        console.log(id)
        let result = chatRooms.filter((room) => room.id == id);
        console.log(result)
        socketIO.to(id).emit("partitaIniziata")
        setInterval(() => {estraiNumero(socket,result[0].numeriDaEstrarre, result[0].numeriEstratti,result[0].id)}, 6000)
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
