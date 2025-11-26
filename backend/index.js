
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io"); 
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const mainRouter = require("./routes/main.router");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

dotenv.config(); // load .env values

yargs(hideBin(process.argv))
  .command("start", "Start the server", {}, StartServer) 
  .command("init", "Initialize a new repository", {}, initRepo)
  .command(
    "add <file>",
    "add file to the repository",
    (y) => {
      y.positional("file", {
        describe: "file to add to staging area",
        type: "string",
      });
    },
    (argv) => addRepo(argv.file)
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (y) => {
      y.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => commitRepo(argv.message)
  )
  .command("push", "Push commits to S3", {}, pushRepo)
  .command("pull", "Pull commits from S3", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to a specific commit",
    (y) => {
      y.positional("commitID", {
        describe: "Commit ID to revert to",
        type: "string",
      });
    },
    (argv) => revertRepo(argv.commitID)
  )
  .demandCommand(1, "You need at least one command")
  .help().argv;

function StartServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json());
  app.use(cors({ origin: "*" }));

  app.use("/", mainRouter);

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.warn("Warning: MONGODB_URI not set in .env. Mongo connect will likely fail.");
  }

  mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting to MongoDB:", err));

  app.get("/", (req, res) => {
    res.send("Hello!");
  });

  const httpServer = http.createServer(app); 
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let user;
  io.on("connection", (socket) => {
    socket.on("join_room", (userID) => {
      user = userID;
      console.log("User joined room:", user);
      socket.join(userID);
    });
  });

  const db = mongoose.connection;
  db.once("open", async () => {
    console.log("MongoDB connection open. CRUD operations can run.");
    // CRUD operations
  });

  httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
