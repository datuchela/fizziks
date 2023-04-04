import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 5050;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
		methods: ["GET", "POST"],
	},
});

app.get("/", (req, res) => {
	res.send("<h1>Hello World</h1>");
});

io.on("connection", (socket) => {
	console.log("user connected ", socket.id);
	socket.on("increment", (newCount: number) => {
		socket.broadcast.emit("increment", newCount);
	});

	socket.on("spawn-object", (obj) => {
		socket.broadcast.emit("spawn-object", obj);
	});
});

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
