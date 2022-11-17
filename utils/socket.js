import { io } from "socket.io-client";
const socket = io.connect("http://217.112.83.206:20000");
export default socket;
