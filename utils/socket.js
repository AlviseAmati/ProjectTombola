import { io } from "socket.io-client";
const socket = io.connect("http://192.168.68.111:4000");
export default socket;