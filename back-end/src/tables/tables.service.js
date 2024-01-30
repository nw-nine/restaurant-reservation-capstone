const knex = require("../db/connection")

function list() {
    return knex("tables")
        .select("*")
        .orderBy("tables.table_name")
}

function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((tables) => tables[0])
}

function read(tableId) {
    return knex("tables")
        .where({table_id: tableId})
        .first()
}

function update(tableId, updatedTable) {
    return knex("tables")
        .where({ table_id: tableId })
        .update(updatedTable, '*');
}

module.exports = {
    list,
    create,
    read,
    update,
}