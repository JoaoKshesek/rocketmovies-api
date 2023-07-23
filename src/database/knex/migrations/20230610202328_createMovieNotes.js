exports.up = knex => knex.schema.createTable("movie_notes", (table) => {
    table.increments("id");
    table.text("title");
    table.text("description");
    table.integer("rating");
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
  
  exports.down = knex => knex.schema.dropTable("movie_notes");