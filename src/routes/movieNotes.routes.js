const { Router } = require("express");

const MovieNotesController = require("../controllers/MovieNotesController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated")
const movieNotesRoutes = Router();
const movieNotesController = new MovieNotesController();

movieNotesRoutes.use(ensureAuthenticated)
movieNotesRoutes.get("/", movieNotesController.index);
movieNotesRoutes.post("/", movieNotesController.create);
movieNotesRoutes.get("/:id", movieNotesController.show);
movieNotesRoutes.post("/update/:id", movieNotesController.update);
movieNotesRoutes.delete("/:id", movieNotesController.delete);

module.exports = movieNotesRoutes;
