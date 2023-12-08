const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const { MongoClient } = require("mongodb");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: 'http://localhost:3000' }
});

const mongoURL = "mongodb://localhost:27017";
let db;

const connectToDatabase = async () => {
  try {
    const client = new MongoClient(mongoURL);
    await client.connect();
    console.log("Successfully connected to MongoDB");
    db = client.db("chat-app");
  } catch (error) {
    console.log("Error establishing connection to MongoDB", error);
    throw error;
  }
};

const startServer = async () => {
  await connectToDatabase();

  io.on("connection", (socket) => {
    console.log("User connected");

    if (!db) {
      console.log("Database connection not established yet. Waiting for connection...");
      return;
    }

    socket.on("message", async (data) => {
      const { username, message } = data;

      const newMessage = {
        username,
        message,
      };

      try {
        await db.collection("messages").insertOne(newMessage);
        socket.broadcast.emit("message", newMessage);
      } catch (error) {
        console.log('Error adding message to database', error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

startServer();