const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const { io } = require("socket.io-client");
const PORT = 4000;
const socketIO = require("socket.io")(http, {
	cors: {
		origin: "*",
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

function trovaGameDaUnPlayer(id){
    for(var r of chatRooms){
        for(var g of r.giocatori){
            if(g.socket == id){
                var obj = {
                    player: g,
                    room: r
                }
                return obj
            }
        }
    }
}

socketIO.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on("createRoom", (name) => { //riceve messaggio dal client
		chatRooms.unshift({ id: generateID(),iniziata: false, giocatori: [], name, numeriEstratti:[], numeriDaEstrarre: creaArrayDaEstrarre()});
		socket.emit("roomsList", chatRooms);
	});
    
    socket.on("exitRoom", () => {
        for(var i = 0; i < chatRooms.length; i++){
            for(var j = 0; j < chatRooms[i].giocatori.length; j++){
                if(chatRooms[i].giocatori[j].socket == socket.id){
                    console.log("Rimosso utente dalla lobby")
                    socketIO.to(chatRooms[i].id).emit("playerUscito",{id: socket.id, username: chatRooms[i].giocatori[j].username})
                    chatRooms[i].giocatori.splice(j, 1);
                    if(chatRooms[i].giocatori.length == 0 && chatRooms[i].iniziata == true){
                        chatRooms.splice(i, 1)
                        console.log("room cancellata")
                        return
                    }
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
                console.log("Iniziata: ")
                console.log(chatRooms[i].iniziata)
                if(chatRooms[i].iniziata == false){
                    chatRooms[i].giocatori.push({
                        socket: socket.id,
                        username: obj.username
                    })
                    socket.join(chatRooms[i].id)
                    socketIO.to(chatRooms[i].id).emit("nuovoPlayerEntrato",obj.username)
                    socket.emit("roomEntered", chatRooms[i].id);
                }else{
                    socket.emit("erroreEnterRoom")
                }
            }
        }
	});

	socket.on("disconnect", () => {
		socket.disconnect();
		console.log("🔥: A user disconnected");
	});

    socket.on("gameStart", () => {
        const { room, player } = trovaGameDaUnPlayer(socket.id)
        if(room != null){
            socketIO.to(room.id).emit("partitaIniziata")
            console.log(room)
            chatRooms[chatRooms.indexOf(room)].iniziata = true
            estraiNumero(room.numeriDaEstrarre, room.numeriEstratti,room.id)
        }
    })

    socket.on("terno", () => {
        const { room, player } = trovaGameDaUnPlayer(socket.id)
        console.log("Terno fatto")
        if(room != null){
            socketIO.to(room.id).emit("ternoFatto",{
                username: player.username,
                id: socket.id
            })
        }
    })

    socket.on("cinquina", () => {
        const { room, player } = trovaGameDaUnPlayer(socket.id)
        console.log("Cinquina fatta")
        if(room != null){
            socketIO.to(room.id).emit("cinquinaFatta",{
                username: player.username,
                id: socket.id
            })
        }
    })

    socket.on("tombola", () => {
        const { room, player } = trovaGameDaUnPlayer(socket.id)
        console.log("Tombola fatta")
        if(room != null){
            socketIO.to(room.id).emit("tombolaFatta",{
                username: player.username,
                id: socket.id
            })

            console.log("Partita finita")
            for(var i = 0; i < chatRooms.length; i++){
                if(room.id == chatRooms[i].id){
                    console.log("Cancello la room")
                    chatRooms.splice(i,1)
                }
            }
        }
    })
});

function estraiNumero(numeriDaEstrarre,numeriEstratti,id){
    if(numeriDaEstrarre.length == 0){
        socketIO.to(id).emit("partitaFinita")
    }else{
        const random = Math.floor(Math.random() * numeriDaEstrarre.length);
        var numeroEstratto = numeriDaEstrarre[random]
        numeriEstratti.push(numeroEstratto)
        socketIO.to(id).emit("numeroEstratto",numeriDaEstrarre[random])
        numeriDaEstrarre.splice(random, 1);
       
        setTimeout(() => {estraiNumero(numeriDaEstrarre,numeriEstratti,id)}, 4000)
    }
}

app.get("/api", (req, res) => {
	res.json(chatRooms);
});

http.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
