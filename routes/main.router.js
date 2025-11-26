const express = require('express');
const app = express();
const userRouter = require('./user.router');

const mainRouter = express.Router();

mainRouter.use(userRouter);

app.get("/", (req, res) => {
    res.send("Hello!");
});

module.exports = mainRouter;

