import { io } from "socket.io-client";

const socket = io("https://qr-food-ordering-system-api.onrender.com");

export default socket;
