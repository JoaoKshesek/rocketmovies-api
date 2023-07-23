const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const user_id = request.user.id;

    if (rating < 1 || rating > 5) {
      throw new AppError("Nota inválida. Insira um valor entre 1 e 5.");
    }

    const [note_id] = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id,
    });

    const tagsInsert = tags.map((name) => {
      return {
        note_id,
        name,
        user_id,
      };
    });
    await knex("movie_tags").insert(tagsInsert);
    response.json();
  }

  async update(request, response) {
    const { title, description, rating, tags } = request.body;
    const { id } = request.params;
    const user_id = request.user.id;

    if (rating < 1 || rating > 5) {
      throw new AppError("Nota inválida. Insira um valor entre 1 e 5.");
    }

    await knex("movie_notes").where({ id }).first().update({
      title: title,
      description: description,
      rating: rating,
    });

    if (tags) {
      await knex("movie_tags").where({ note_id: id }).del();
    }

    const tagsInsert = tags.map((name) => {
      return {
        note_id: id,
        name: name,
        user_id: user_id,
      };
    });
    await knex("movie_tags").insert(tagsInsert);
    response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("movie_notes").where({ id }).first();
    const tags = await knex("movie_tags")
      .where({ note_id: id })
      .orderBy("name");

    return response.json({ ...note, tags });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("movie_notes").where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    const { title, tags } = request.query;
    const user_id = request.user.id;

    let movie_notes;

    if (tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim());

      movie_notes = await knex("movie_tags")
        .select("movie_notes.id", "movie_notes.title", "movie_notes.user_id")
        .where("movie_notes.user_id", user_id)
        .whereLike("movie_notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
        .orderBy("movie_notes.title");
    } else
      movie_notes = await knex("movie_notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    const userTags = await knex("movie_tags");
    const movieNotesWithTags = movie_notes.map((movie_note) => {
      const movieNoteTags = userTags.filter(
        (tag) => tag.note_id === movie_note.id
      );
      return {
        ...movie_note,
        tags: movieNoteTags,
      };
    });

    return response.json({ movieNotesWithTags });
  }
}

module.exports = MovieNotesController;
