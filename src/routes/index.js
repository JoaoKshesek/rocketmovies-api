const { Router } = require("express");

const usersRouter = require("./user.routes");
const movieNotesRoutes = require("./movieNotes.routes");
const movieTagsRouter = require("./movieTags.routes");
const sessionsRouter = require("./sessions.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/movies", movieNotesRoutes);
routes.use("/tags", movieTagsRouter);

module.exports = routes;
