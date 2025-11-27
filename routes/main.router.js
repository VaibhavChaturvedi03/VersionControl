const express = require('express');
const app = express();
const userRouter = require('./user.router');
const repoRouter = require('./repo.router');

const mainRouter = express.Router();

mainRouter.use(userRouter);
mainRouter.use(repoRouter);

app.get("/", (req, res) => {
    res.send("Hello!");
});

module.exports = mainRouter;

